/**
 * MCP server for Hugeicons search and usage documentation
 * This server provides tools to:
 * - Search icons by name or tags
 * - Get icon details and usage information
 * - List all available icons
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import { trackMCP, createConfig } from "agnost";
import { IconInfo, IconStyle } from "./types.js";
import { DEFAULT_SEARCH_LIMIT, MAX_SEARCH_LIMIT, searchIcons } from "./utils/search.js";
import { getAllGlyphs, getGlyphByStyle, IconNotFoundError } from "./utils/glyphs.js";
import { normalizeIconName } from "./utils/icon-name.js";
import { Platform, PLATFORM_USAGE } from "./utils/platform-usage.js";
import { convertPlatformUsageToMarkdown } from "./utils/markdown-converter.js";

// The icon index is shared by every server instance, so the HTTP server
// (one instance per request) fetches it once and refreshes it periodically.
const ICONS_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const ICONS_FETCH_TIMEOUT_MS = 15_000;
// After a failed fetch, wait this long before trying the API again
const ICONS_RETRY_DELAY_MS = 30_000;
let iconsIndex: { icons: IconInfo[]; fetchedAt: number } | null = null;
let iconsRequest: Promise<IconInfo[]> | null = null;
let iconsFailure: { error: unknown; at: number } | null = null;

const DEFAULT_LIST_LIMIT = 200;
const MAX_LIST_LIMIT = 500;

/**
 * A problem the assistant can fix (bad arguments, unknown icon). Reported as a
 * tool result with isError, so the model sees the message instead of a protocol error.
 */
class ToolError extends Error {}

function jsonResult(data: unknown) {
  return { content: [{ type: "text", text: JSON.stringify(data) }] };
}

function errorResult(message: string) {
  return { isError: true, content: [{ type: "text", text: message }] };
}

function fetchIcons(): Promise<IconInfo[]> {
  // Concurrent callers share one in-flight request
  iconsRequest ??= (async () => {
    try {
      const response = await axios.get<{ icons: IconInfo[] }>("https://hugeicons.com/api/icons", {
        timeout: ICONS_FETCH_TIMEOUT_MS,
      });
      iconsIndex = { icons: response.data.icons, fetchedAt: Date.now() };
      iconsFailure = null;
      return iconsIndex.icons;
    } catch (error) {
      iconsFailure = { error, at: Date.now() };
      throw error;
    } finally {
      iconsRequest = null;
    }
  })();

  return iconsRequest;
}

/**
 * Get the icon index. A stale index is served while it refreshes in the
 * background, and is kept if the refresh fails.
 */
async function loadIcons(): Promise<IconInfo[]> {
  const backingOff = iconsFailure !== null && Date.now() - iconsFailure.at < ICONS_RETRY_DELAY_MS;

  if (iconsIndex) {
    const stale = Date.now() - iconsIndex.fetchedAt >= ICONS_CACHE_TTL_MS;
    if (stale && !backingOff) {
      fetchIcons().catch((error) => console.error("Failed to refresh the icon index:", error));
    }
    return iconsIndex.icons;
  }

  if (backingOff) throw iconsFailure!.error;
  return fetchIcons();
}

/**
 * Fetch the icon index ahead of the first request (used by the HTTP server at startup)
 */
export function preloadIcons(): Promise<void> {
  return loadIcons().then(
    () => undefined,
    (error) => console.error("Failed to preload the icon index:", error),
  );
}

/**
 * HugeiconsServer class that handles all the icon search and reference functionality
 */
export class HugeiconsServer {
  private server: Server;
  private iconsCache: IconInfo[] | null = null;

  constructor() {
    this.server = new Server(
      {
        name: "hugeicons-mcp",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
          resources: {}
        },
      }
    );

    this.setupToolHandlers();
    this.setupResourceHandlers();
    
    // Add analytics tracking
    trackMCP(this.server, "54bfb286-b439-4dc8-9fbe-d08ce48c5d8d", createConfig({
      endpoint: "https://api.agnost.ai"
    }));
    
    this.server.onerror = (error) => console.error("[MCP Error]", error);
  }

  /**
   * Set up the tool handlers for the server
   */
  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "list_icons",
          description: "List Hugeicons icon names, a page at a time. Optionally filter by category. The first page without a category also returns every category with its icon count. Prefer search_icons to find an icon for a purpose.",
          inputSchema: {
            type: "object",
            properties: {
              category: {
                type: "string",
                description: "Only list icons in this category (e.g. 'arrows', 'e-commerce')",
              },
              offset: {
                type: "number",
                description: "Number of icons to skip. Use next_offset from the previous page. Defaults to 0",
              },
              limit: {
                type: "number",
                description: `Icons per page, 1-${MAX_LIST_LIMIT}. Defaults to ${DEFAULT_LIST_LIMIT}`,
              },
            },
            required: [],
          },
        },
        {
          name: "search_icons",
          description: "Search icons by name or tags. Exact name and tag matches rank first. Separate multiple searches with commas (e.g. 'home, notification, settings') to get results for each.",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "What to search for. Separate multiple searches with commas",
              },
              limit: {
                type: "number",
                description: `Maximum results per search, 1-${MAX_SEARCH_LIMIT}. Defaults to ${DEFAULT_SEARCH_LIMIT}`,
              },
            },
            required: ["query"],
          },
        },
        {
          name: "get_platform_usage",
          description: "Get platform-specific usage instructions for Hugeicons",
          inputSchema: {
            type: "object",
            properties: {
              platform: {
                type: "string",
                description: "Platform name (react, vue, angular, svelte, solid-js, react-native, flutter, html)",
                enum: ["react", "vue", "angular", "svelte", "solid-js", "react-native", "flutter", "html"]
              },
            },
            required: ["platform"],
          },
        },
        {
          name: "get_icon_glyphs",
          description: "Get all glyphs (unicode characters) for a specific icon across all available styles",
          inputSchema: {
            type: "object",
            properties: {
              icon_name: {
                type: "string",
                description: "The icon name (e.g. 'home-01', 'notification-02'). Case and spacing are normalized",
              }
            },
            required: ["icon_name"],
          },
        },
        {
          name: "get_icon_glyph_by_style",
          description: "Get the glyph (unicode character) for a specific icon with a particular style",
          inputSchema: {
            type: "object",
            properties: {
              icon_name: {
                type: "string",
                description: "The icon name (e.g. 'home-01', 'notification-02'). Case and spacing are normalized",
              },
              style: {
                type: "string",
                description: "The icon style",
                enum: [
                  "bulk-rounded",
                  "duotone-rounded",
                  "duotone-standard",
                  "solid-rounded",
                  "solid-sharp",
                  "solid-standard",
                  "stroke-rounded",
                  "stroke-sharp",
                  "stroke-standard",
                  "twotone-rounded"
                ]
              }
            },
            required: ["icon_name", "style"],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const args = request.params.arguments ?? {};
      try {
        switch (request.params.name) {
          case "list_icons":
            return await this.handleListIcons(args);
          case "search_icons":
            return await this.handleSearchIcons(args);
          case "get_platform_usage":
            return this.handleGetPlatformUsage(args);
          case "get_icon_glyphs":
            return await this.handleGetIconGlyphs(args);
          case "get_icon_glyph_by_style":
            return await this.handleGetIconGlyphByStyle(args);
        }
      } catch (error) {
        // Tool failures go back to the model as results it can act on
        if (error instanceof ToolError || error instanceof IconNotFoundError) {
          return errorResult(error.message);
        }
        console.error(`[Tool Error] ${request.params.name}`, error);
        return errorResult(error instanceof Error ? error.message : "Unexpected error");
      }

      throw new McpError(
        ErrorCode.MethodNotFound,
        `Unknown tool: ${request.params.name}`
      );
    });
  }

  /**
   * Set up the resource handlers for the server
   */
  private setupResourceHandlers() {
    // List available documentation resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: "hugeicons://docs/platforms/react",
            name: "React Usage Guide",
            mimeType: "text/markdown",
            description: "React implementation guide for Hugeicons"
          },
          {
            uri: "hugeicons://docs/platforms/vue",
            name: "Vue Usage Guide",
            mimeType: "text/markdown",
            description: "Vue implementation guide for Hugeicons"
          },
          {
            uri: "hugeicons://docs/platforms/angular",
            name: "Angular Usage Guide",
            mimeType: "text/markdown",
            description: "Angular implementation guide for Hugeicons"
          },
          {
            uri: "hugeicons://docs/platforms/svelte",
            name: "Svelte Usage Guide",
            mimeType: "text/markdown",
            description: "Svelte implementation guide for Hugeicons"
          },
          {
            uri: "hugeicons://docs/platforms/solid-js",
            name: "SolidJS Usage Guide",
            mimeType: "text/markdown",
            description: "SolidJS implementation guide for Hugeicons"
          },
          {
            uri: "hugeicons://docs/platforms/react-native",
            name: "React Native Usage Guide",
            mimeType: "text/markdown",
            description: "React Native implementation guide for Hugeicons"
          },
          {
            uri: "hugeicons://docs/platforms/flutter",
            name: "Flutter Usage Guide",
            mimeType: "text/markdown",
            description: "Flutter implementation guide for Hugeicons"
          },
          {
            uri: "hugeicons://docs/platforms/html",
            name: "HTML Usage Guide",
            mimeType: "text/markdown",
            description: "HTML implementation guide for Hugeicons (font-based)"
          },
          {
            uri: "hugeicons://icons/index",
            name: "Icons Index",
            mimeType: "application/json",
            description: "Complete index of all Hugeicons"
          }
        ]
      };
    });

    // Handle resource reading
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const uri = request.params.uri;
      
      if (uri.startsWith("hugeicons://docs/platforms/")) {
        const platform = uri.split("/").pop() as Platform;
        const usage = PLATFORM_USAGE[platform];
        
        if (!usage) {
          throw new McpError(
            ErrorCode.InvalidRequest,
            `Platform documentation not found for: ${platform}`
          );
        }
        
        return {
          contents: [{
            uri,
            mimeType: "text/markdown",
            text: convertPlatformUsageToMarkdown(usage)
          }]
        };
      }
      
      if (uri === "hugeicons://icons/index") {
        await this.ensureIconsLoaded();
        return {
          contents: [{
            uri,
            mimeType: "application/json",
            text: JSON.stringify(this.iconsCache!.map(({ name, category }) => ({ name, category })))
          }]
        };
      }

      throw new McpError(
        ErrorCode.InvalidRequest,
        `Resource not found: ${uri}`
      );
    });
  }

  /**
   * Handle the list_icons tool request
   */
  private async handleListIcons(args: any) {
    const category = this.optionalString(args, "category")?.toLowerCase();
    const offset = this.intArg(args, "offset", 0, 0, Number.MAX_SAFE_INTEGER);
    const limit = this.intArg(args, "limit", DEFAULT_LIST_LIMIT, 1, MAX_LIST_LIMIT);

    await this.ensureIconsLoaded();
    const all = this.iconsCache!;
    const icons = category ? all.filter((icon) => icon.category === category) : all;

    if (category && icons.length === 0) {
      throw new ToolError(
        `Unknown category '${category}'. Categories: ${Object.keys(this.categoryCounts(all)).join(", ")}`
      );
    }

    const nextOffset = offset + limit;
    return jsonResult({
      ...(category ? { category } : {}),
      total: icons.length,
      offset,
      limit,
      next_offset: nextOffset < icons.length ? nextOffset : null,
      ...(!category && offset === 0 ? { categories: this.categoryCounts(all) } : {}),
      icons: icons.slice(offset, nextOffset).map((icon) => icon.name),
    });
  }

  /**
   * Icon count per category, sorted by name
   */
  private categoryCounts(icons: IconInfo[]): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const icon of icons) counts[icon.category] = (counts[icon.category] ?? 0) + 1;
    return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
  }

  /**
   * Handle the search_icons tool request
   */
  private async handleSearchIcons(args: any) {
    const query = this.validateSearchQuery(args);
    const limit = this.intArg(args, "limit", DEFAULT_SEARCH_LIMIT, 1, MAX_SEARCH_LIMIT);
    return jsonResult(await searchIcons(query, limit));
  }

  /**
   * Handle the get_platform_usage tool request
   */
  private handleGetPlatformUsage(args: any) {
    const platform = this.validatePlatform(args);
    return jsonResult(PLATFORM_USAGE[platform]);
  }

  /**
   * Handle the get_icon_glyphs tool request
   */
  private async handleGetIconGlyphs(args: any) {
    const iconName = this.validateIconName(args);
    return jsonResult(await getAllGlyphs(iconName));
  }

  /**
   * Handle the get_icon_glyph_by_style tool request
   */
  private async handleGetIconGlyphByStyle(args: any) {
    const iconName = this.validateIconName(args);
    const style = this.validateIconStyle(args);
    return jsonResult(await getGlyphByStyle(iconName, style));
  }

  /**
   * Read an optional string argument
   */
  private optionalString(args: any, key: string): string | undefined {
    const value = args?.[key];
    if (value === undefined || value === null || value === "") return undefined;
    if (typeof value !== "string") throw new ToolError(`${key} must be a string`);
    return value.trim() || undefined;
  }

  /**
   * Read an optional integer argument within [min, max]
   */
  private intArg(args: any, key: string, fallback: number, min: number, max: number): number {
    const value = args?.[key];
    if (value === undefined || value === null || value === "") return fallback;
    const number = Number(value);
    if (!Number.isInteger(number) || number < min || number > max) {
      throw new ToolError(`${key} must be a whole number from ${min} to ${max}`);
    }
    return number;
  }

  /**
   * Validate the search query argument
   */
  private validateSearchQuery(args: any): string {
    if (!args || typeof args.query !== "string" || !args.query.trim()) {
      throw new ToolError(
        "Search query must be a non-empty string"
      );
    }
    return args.query.trim();
  }

  /**
   * Validate the platform argument
   */
  private validatePlatform(args: any): Platform {
    if (!args || typeof args.platform !== "string" || !args.platform.trim()) {
      throw new ToolError(
        "Platform must be a non-empty string"
      );
    }

    const platform = args.platform.trim().toLowerCase() as Platform;
    if (!Object.keys(PLATFORM_USAGE).includes(platform)) {
      throw new ToolError(
        `Invalid platform. Supported platforms are: ${Object.keys(PLATFORM_USAGE).join(', ')}`
      );
    }

    return platform;
  }

  /**
   * Validate the icon name argument
   */
  private validateIconName(args: any): string {
    if (!args || typeof args.icon_name !== "string" || !args.icon_name.trim()) {
      throw new ToolError(
        "Icon name must be a non-empty string"
      );
    }
    return normalizeIconName(args.icon_name);
  }

  /**
   * Validate the icon style argument
   */
  private validateIconStyle(args: any): IconStyle {
    if (!args || typeof args.style !== "string" || !args.style.trim()) {
      throw new ToolError(
        "Style must be a non-empty string"
      );
    }

    const validStyles: IconStyle[] = [
      'bulk-rounded',
      'duotone-rounded',
      'duotone-standard',
      'solid-rounded',
      'solid-sharp',
      'solid-standard',
      'stroke-rounded',
      'stroke-sharp',
      'stroke-standard',
      'twotone-rounded'
    ];

    const style = args.style.trim().toLowerCase() as IconStyle;
    if (!validStyles.includes(style)) {
      throw new ToolError(
        `Invalid style. Supported styles are: ${validStyles.join(', ')}`
      );
    }

    return style;
  }

  /**
   * Ensure the icons data is loaded
   */
  private async ensureIconsLoaded() {
    if (this.iconsCache) return;

    try {
      this.iconsCache = await loadIcons();
    } catch (error) {
      throw new Error("The Hugeicons icon list is unavailable. Try again shortly.");
    }
  }

  /**
   * Connect the server to a transport (stdio or HTTP)
   */
  async connect(transport: Transport) {
    await this.server.connect(transport);
  }

  async close() {
    await this.server.close();
  }
}
