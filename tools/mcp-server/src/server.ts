/**
 * MCP server for Hugeicons search and usage documentation
 * This server provides tools to:
 * - Search icons by name or tags
 * - Get ready-to-paste code and platform usage for an icon
 * - List all available icons and look up web font glyphs
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ReadResourceRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { createRequire } from "node:module";
import { trackMCP, createConfig } from "agnost";
import { FREE_STYLE, ICON_STYLES, IconStyle } from "./types.js";
import { IconIndex, loadIconIndex } from "./icons-index.js";
import { DEFAULT_LIST_LIMIT, MAX_LIST_LIMIT, SERVER_INSTRUCTIONS, TOOLS } from "./tool-definitions.js";
import { DEFAULT_SEARCH_LIMIT, MAX_SEARCH_LIMIT, MAX_SEARCH_TERMS, searchIcons, splitTerms } from "./utils/search.js";
import { getAllGlyphs, getGlyphByStyle, IconNotFoundError } from "./utils/glyphs.js";
import { getIconCode } from "./utils/code-snippets.js";
import { normalizeIconName, webfontName } from "./utils/icon-name.js";
import { Platform, PLATFORM_LABELS, PLATFORM_USAGE, PLATFORMS } from "./utils/platform-usage.js";
import { convertPlatformUsageToMarkdown } from "./utils/markdown-converter.js";

const { version: SERVER_VERSION } = createRequire(import.meta.url)("../package.json") as { version: string };

const PLATFORM_DOCS_PREFIX = "hugeicons://docs/platforms/";
const ICONS_INDEX_URI = "hugeicons://icons/index";

/**
 * A problem the assistant can fix (bad arguments, unknown icon). Reported as a
 * tool result with isError, so the model sees the message instead of a protocol error.
 */
class ToolError extends Error {}

/**
 * A tool result with structured content, plus the same JSON as text for clients
 * that don't read structuredContent
 */
function jsonResult(data: object) {
  return { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: data as Record<string, unknown> };
}

function errorResult(message: string) {
  return { isError: true, content: [{ type: "text", text: message }] };
}

/**
 * HugeiconsServer class that handles all the icon search and reference functionality
 */
export class HugeiconsServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "hugeicons-mcp",
        title: "Hugeicons",
        version: SERVER_VERSION,
      },
      {
        capabilities: {
          tools: {},
          resources: {}
        },
        instructions: SERVER_INSTRUCTIONS,
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
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const args = request.params.arguments ?? {};
      try {
        switch (request.params.name) {
          case "search_icons":
            return await this.handleSearchIcons(args);
          case "get_icon_code":
            return await this.handleGetIconCode(args);
          case "list_icons":
            return await this.handleListIcons(args);
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
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
        ...PLATFORMS.map((platform) => ({
          uri: `${PLATFORM_DOCS_PREFIX}${platform}`,
          name: `${PLATFORM_LABELS[platform]} Usage Guide`,
          mimeType: "text/markdown",
          description: `${PLATFORM_LABELS[platform]} implementation guide for Hugeicons`,
        })),
        {
          uri: ICONS_INDEX_URI,
          name: "Icons Index",
          mimeType: "application/json",
          description: "Complete index of all Hugeicons",
        },
      ],
    }));

    this.server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => ({
      resourceTemplates: [
        {
          uriTemplate: `${PLATFORM_DOCS_PREFIX}{platform}`,
          name: "Platform Usage Guide",
          mimeType: "text/markdown",
          description: `Implementation guide for Hugeicons on a platform: ${PLATFORMS.join(", ")}`,
        },
      ],
    }));

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const uri = request.params.uri;

      if (uri.startsWith(PLATFORM_DOCS_PREFIX)) {
        const platform = uri.slice(PLATFORM_DOCS_PREFIX.length) as Platform;
        if (!PLATFORMS.includes(platform)) {
          throw new McpError(
            ErrorCode.InvalidParams,
            `Platform documentation not found for: ${platform}. Platforms: ${PLATFORMS.join(", ")}`
          );
        }

        return {
          contents: [{
            uri,
            mimeType: "text/markdown",
            text: convertPlatformUsageToMarkdown(PLATFORM_USAGE[platform])
          }]
        };
      }

      if (uri === ICONS_INDEX_URI) {
        const index = await this.iconIndex();
        return {
          contents: [{
            uri,
            mimeType: "application/json",
            text: index.toResourceJson()
          }]
        };
      }

      throw new McpError(
        ErrorCode.InvalidParams,
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

    const index = await this.iconIndex();
    const icons = category ? index.icons.filter((icon) => icon.category === category) : index.icons;

    if (category && icons.length === 0) {
      throw new ToolError(
        `Unknown category '${category}'. Categories: ${Object.keys(index.categoryCounts).join(", ")}`
      );
    }

    const nextOffset = offset + limit;
    return jsonResult({
      ...(category ? { category } : {}),
      total: icons.length,
      offset,
      limit,
      next_offset: nextOffset < icons.length ? nextOffset : null,
      ...(!category && offset === 0 ? { categories: index.categoryCounts } : {}),
      icons: icons.slice(offset, nextOffset).map((icon) => icon.name),
    });
  }

  /**
   * Handle the search_icons tool request
   */
  private async handleSearchIcons(args: any) {
    const query = this.requiredString(args, "query", "Search query");
    const terms = splitTerms(query);
    if (terms.length > MAX_SEARCH_TERMS) {
      throw new ToolError(
        `Too many search terms (${terms.length}). Search at most ${MAX_SEARCH_TERMS} per call — split the rest into another call.`,
      );
    }
    const limit = this.intArg(args, "limit", DEFAULT_SEARCH_LIMIT, 1, MAX_SEARCH_LIMIT);
    const includeTags = args?.include_tags === true;
    return jsonResult({ searches: await searchIcons(query, limit, includeTags) });
  }

  /**
   * Handle the get_icon_code tool request
   */
  private async handleGetIconCode(args: any) {
    const platform = this.validatePlatform(args);
    const style = this.validateIconStyle(args, FREE_STYLE);
    const icon = await this.resolveIconName(args);
    return jsonResult(getIconCode(icon, platform, style));
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
    const icon = await this.resolveIconName(args);
    // The glyph API keys icons by their web font name ("3d-move" is "three-d-move")
    return jsonResult({ icon, glyphs: await getAllGlyphs(webfontName(icon)) });
  }

  /**
   * Handle the get_icon_glyph_by_style tool request
   */
  private async handleGetIconGlyphByStyle(args: any) {
    const icon = await this.resolveIconName(args);
    const style = this.validateIconStyle(args);
    return jsonResult({ icon, style, ...(await getGlyphByStyle(webfontName(icon), style)) });
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
   * Read a required, non-empty string argument
   */
  private requiredString(args: any, key: string, label: string): string {
    const value = args?.[key];
    if (typeof value !== "string" || !value.trim()) {
      throw new ToolError(`${label} must be a non-empty string`);
    }
    return value.trim();
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
   * Validate the platform argument
   */
  private validatePlatform(args: any): Platform {
    const platform = this.requiredString(args, "platform", "Platform").toLowerCase() as Platform;
    if (!PLATFORMS.includes(platform)) {
      throw new ToolError(`Invalid platform. Supported platforms are: ${PLATFORMS.join(", ")}`);
    }
    return platform;
  }

  /**
   * Validate the style argument, falling back to `fallback` when it's optional and missing
   */
  private validateIconStyle(args: any, fallback?: IconStyle): IconStyle {
    const value = fallback ? this.optionalString(args, "style") ?? fallback : this.requiredString(args, "style", "Style");
    const style = value.toLowerCase() as IconStyle;
    if (!ICON_STYLES.includes(style)) {
      throw new ToolError(`Invalid style. Supported styles are: ${ICON_STYLES.join(", ")}`);
    }
    return style;
  }

  /**
   * Resolve the icon_name argument to an icon in the index, suggesting close
   * matches when there isn't one. If the index can't be loaded, fall back to the
   * normalized name and let the glyph API decide.
   */
  private async resolveIconName(args: any): Promise<string> {
    const input = this.requiredString(args, "icon_name", "Icon name");

    let index: IconIndex;
    try {
      index = await loadIconIndex();
    } catch {
      return normalizeIconName(input);
    }

    const name = index.resolve(input);
    if (name) return name;

    const suggestions = index.suggest(input);
    throw new ToolError(
      suggestions.length > 0
        ? `Icon '${input}' not found. Did you mean: ${suggestions.join(", ")}?`
        : `Icon '${input}' not found. Use search_icons to find icon names.`
    );
  }

  /**
   * The icon index, or an error the model can read when it can't be loaded
   */
  private async iconIndex(): Promise<IconIndex> {
    try {
      return await loadIconIndex();
    } catch {
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
