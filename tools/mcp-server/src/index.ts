#!/usr/bin/env node

/**
 * MCP server for Hugeicons search and usage documentation
 * This server provides tools to:
 * - Search icons by name or tags
 * - Get icon details and usage information
 * - List all available icons
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
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
import { IconInfo, SearchApiResponse, IconStyle } from "./types.js";
import { searchIcons } from "./utils/search.js";
import { getAllGlyphs, getGlyphByStyle } from "./utils/glyphs.js";
import { Platform, PLATFORM_USAGE } from "./utils/platform-usage.js";
import { convertPlatformUsageToMarkdown } from "./utils/markdown-converter.js";

/**
 * HugeiconsServer class that handles all the icon search and reference functionality
 */
class HugeiconsServer {
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
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * Set up the tool handlers for the server
   */
  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "list_icons",
          description: "Get a list of all available Hugeicons icons",
          inputSchema: {
            type: "object",
            properties: {},
            required: [],
          },
        },
        {
          name: "search_icons",
          description: "Search for icons by name or tags. Use commas to search for multiple icons (e.g. 'home, notification, settings')",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query to find relevant icons. Separate multiple searches with commas",
              }
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
                description: "Platform name (react, vue, angular, svelte, react-native, flutter, html)",
                enum: ["react", "vue", "angular", "svelte", "react-native", "flutter", "html"]
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
                description: "The name of the icon (e.g., 'home-01', 'notification-02')",
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
                description: "The name of the icon (e.g., 'home-01', 'notification-02')",
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
      switch (request.params.name) {
        case "list_icons":
          return await this.handleListIcons();
        case "search_icons":
          return await this.handleSearchIcons(request.params.arguments);
        case "get_platform_usage":
          return await this.handleGetPlatformUsage(request.params.arguments);
        case "get_icon_glyphs":
          return await this.handleGetIconGlyphs(request.params.arguments);
        case "get_icon_glyph_by_style":
          return await this.handleGetIconGlyphByStyle(request.params.arguments);
        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
      }
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
            text: JSON.stringify(this.iconsCache, null, 2)
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
  private async handleListIcons() {
    try {
      await this.ensureIconsLoaded();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(this.iconsCache, null, 2),
          },
        ],
      };
    } catch (error) {
      if (error && typeof error === 'object' && 'isAxiosError' in error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to list icons: ${(error as any).message}`
        );
      }
      throw error;
    }
  }

  /**
   * Handle the search_icons tool request
   */
  private async handleSearchIcons(args: any) {
    try {
      const query = this.validateSearchQuery(args);
      const results = await searchIcons(query);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    } catch (error) {
      if (error && typeof error === 'object' && 'isAxiosError' in error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to search icons: ${(error as any).message}`
        );
      }
      throw error;
    }
  }

  /**
   * Handle the get_platform_usage tool request
   */
  private async handleGetPlatformUsage(args: any) {
    try {
      const platform = this.validatePlatform(args);
      const usage = PLATFORM_USAGE[platform];

      if (!usage) {
        throw new McpError(
          ErrorCode.InvalidRequest,
          `Platform '${platform}' is not supported`
        );
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(usage, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to get platform usage: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Handle the get_icon_glyphs tool request
   */
  private async handleGetIconGlyphs(args: any) {
    try {
      const iconName = this.validateIconName(args);
      const glyphs = await getAllGlyphs(iconName);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(glyphs, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to get icon glyphs: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Handle the get_icon_glyph_by_style tool request
   */
  private async handleGetIconGlyphByStyle(args: any) {
    try {
      const iconName = this.validateIconName(args);
      const style = this.validateIconStyle(args);
      const glyph = await getGlyphByStyle(iconName, style);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(glyph, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to get icon glyph by style: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Validate the search query argument
   */
  private validateSearchQuery(args: any): string {
    if (!args || typeof args.query !== "string" || !args.query.trim()) {
      throw new McpError(
        ErrorCode.InvalidRequest,
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
      throw new McpError(
        ErrorCode.InvalidRequest,
        "Platform must be a non-empty string"
      );
    }

    const platform = args.platform.trim().toLowerCase() as Platform;
    if (!Object.keys(PLATFORM_USAGE).includes(platform)) {
      throw new McpError(
        ErrorCode.InvalidRequest,
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
      throw new McpError(
        ErrorCode.InvalidRequest,
        "Icon name must be a non-empty string"
      );
    }
    return args.icon_name.trim();
  }

  /**
   * Validate the icon style argument
   */
  private validateIconStyle(args: any): IconStyle {
    if (!args || typeof args.style !== "string" || !args.style.trim()) {
      throw new McpError(
        ErrorCode.InvalidRequest,
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

    const style = args.style.trim() as IconStyle;
    if (!validStyles.includes(style)) {
      throw new McpError(
        ErrorCode.InvalidRequest,
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
      const response = await axios.get<{ icons: IconInfo[] }>("https://hugeicons.com/api/icons");
      this.iconsCache = response.data.icons;
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        "Failed to load icons data"
      );
    }
  }

  /**
   * Run the server
   */
  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("hugeicons MCP server running on stdio");
  }
}

// Run the server
const server = new HugeiconsServer();
server.run().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
