/**
 * Tool definitions (input and output schemas) for the Hugeicons MCP server
 */

import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { FREE_STYLE, ICON_STYLES } from "./types.js";
import { DEFAULT_SEARCH_LIMIT, MAX_SEARCH_LIMIT } from "./utils/search.js";
import { PLATFORMS } from "./utils/platform-usage.js";

export const DEFAULT_LIST_LIMIT = 200;
export const MAX_LIST_LIMIT = 500;

/**
 * Sent to clients on initialize, so the model knows how the tools fit together
 */
export const SERVER_INSTRUCTIONS = `Hugeicons is an icon library with 6,000+ icons in 10 styles. Only stroke-rounded is free; the other styles need a Hugeicons Pro license.

To add an icon to code:
1. Find it with search_icons (separate several searches with commas). Each result has the icon name and its JavaScript export name (component).
2. Call get_icon_code with the icon name, the platform, and a style (default ${FREE_STYLE}) for the exact install command, import and usage.
Don't guess export names: some are spelled out (2nd-bracket is SecondBracketIcon, sorting-1-9 is SortingOneNineIcon).

get_platform_usage covers a framework's setup and component props. get_icon_glyphs and get_icon_glyph_by_style return web font unicode characters.`;

// Every tool only reads from the Hugeicons catalog
const READ_ONLY = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const;

const iconNameInput = {
  type: "string",
  description: "The icon name (e.g. 'home-01'). Export and constant names such as 'Home01Icon' or 'strokeRoundedHome01' are accepted",
} as const;

const styleInput = {
  type: "string",
  description: "The icon style",
  enum: [...ICON_STYLES],
} as const;

const glyphOutput = {
  type: "object",
  properties: {
    icon_name: { type: "string" },
    style: { type: "string" },
    unicode: { type: "string" },
    unicode_decimal: { type: "integer" },
  },
  required: ["icon_name", "style", "unicode", "unicode_decimal"],
} as const;

export const TOOLS: Tool[] = [
  {
    name: "search_icons",
    title: "Search icons",
    description: "Search icons by name or tags. Exact name and tag matches rank first. Separate multiple searches with commas (e.g. 'home, notification, settings') to get results for each. Each result includes its JavaScript export name.",
    annotations: { title: "Search icons", ...READ_ONLY },
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "What to search for. Separate multiple searches with commas",
        },
        limit: {
          type: "integer",
          minimum: 1,
          maximum: MAX_SEARCH_LIMIT,
          description: `Maximum results per search. Defaults to ${DEFAULT_SEARCH_LIMIT}`,
        },
      },
      required: ["query"],
    },
    outputSchema: {
      type: "object",
      properties: {
        searches: {
          type: "array",
          items: {
            type: "object",
            properties: {
              query: { type: "string" },
              total: { type: "integer", description: "Relevant matches before the limit" },
              fuzzy: { type: "boolean", description: "True when nothing matched closely and these are best guesses" },
              results: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    component: { type: "string", description: "Export name in the JavaScript packages" },
                    category: { type: "string" },
                    tags: { type: "array", items: { type: "string" } },
                  },
                  required: ["name", "component", "category", "tags"],
                },
              },
            },
            required: ["query", "total", "fuzzy", "results"],
          },
        },
      },
      required: ["searches"],
    },
  },
  {
    name: "get_icon_code",
    title: "Get icon code",
    description: "Get the exact install command, import and usage snippet for one icon on a platform, with the correct export or constant name for the style.",
    annotations: { title: "Get icon code", ...READ_ONLY },
    inputSchema: {
      type: "object",
      properties: {
        icon_name: iconNameInput,
        platform: {
          type: "string",
          description: "Where the icon will be used",
          enum: [...PLATFORMS],
        },
        style: { ...styleInput, description: `The icon style. Defaults to ${FREE_STYLE}, the free style` },
      },
      required: ["icon_name", "platform"],
    },
    outputSchema: {
      type: "object",
      properties: {
        icon: { type: "string" },
        platform: { type: "string" },
        style: { type: "string" },
        free: { type: "boolean" },
        reference: { type: "string", description: "The export, constant or classes to use in code" },
        install: { type: "string" },
        usage: { type: "string" },
        note: { type: "string" },
      },
      required: ["icon", "platform", "style", "free", "reference", "install", "usage"],
    },
  },
  {
    name: "list_icons",
    title: "List icons",
    description: "List Hugeicons icon names, a page at a time. Optionally filter by category. The first page without a category also returns every category with its icon count. Prefer search_icons to find an icon for a purpose.",
    annotations: { title: "List icons", ...READ_ONLY },
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Only list icons in this category (e.g. 'arrows', 'e-commerce')",
        },
        offset: {
          type: "integer",
          minimum: 0,
          description: "Number of icons to skip. Use next_offset from the previous page. Defaults to 0",
        },
        limit: {
          type: "integer",
          minimum: 1,
          maximum: MAX_LIST_LIMIT,
          description: `Icons per page. Defaults to ${DEFAULT_LIST_LIMIT}`,
        },
      },
    },
    outputSchema: {
      type: "object",
      properties: {
        category: { type: "string" },
        total: { type: "integer" },
        offset: { type: "integer" },
        limit: { type: "integer" },
        next_offset: { type: ["integer", "null"] },
        categories: { type: "object", additionalProperties: { type: "integer" } },
        icons: { type: "array", items: { type: "string" } },
      },
      required: ["total", "offset", "limit", "next_offset", "icons"],
    },
  },
  {
    name: "get_platform_usage",
    title: "Get platform usage",
    description: "Get setup instructions and component props for using Hugeicons on a platform",
    annotations: { title: "Get platform usage", ...READ_ONLY },
    inputSchema: {
      type: "object",
      properties: {
        platform: {
          type: "string",
          description: "Platform name",
          enum: [...PLATFORMS],
        },
      },
      required: ["platform"],
    },
    outputSchema: {
      type: "object",
      properties: {
        platform: { type: "string" },
        installation: {
          type: "object",
          properties: {
            core: { type: "string" },
            packages: { type: "array", items: { type: "string" } },
          },
          required: ["core", "packages"],
        },
        basicUsage: { type: "string" },
        props: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              type: { type: "string" },
              default: { type: "string" },
              description: { type: "string" },
            },
            required: ["name", "type", "description"],
          },
        },
      },
      required: ["platform", "installation", "basicUsage"],
    },
  },
  {
    name: "get_icon_glyphs",
    title: "Get icon glyphs",
    description: "Get the web font glyphs (unicode characters) for an icon in every available style",
    annotations: { title: "Get icon glyphs", ...READ_ONLY },
    inputSchema: {
      type: "object",
      properties: { icon_name: iconNameInput },
      required: ["icon_name"],
    },
    outputSchema: {
      type: "object",
      properties: {
        icon: { type: "string" },
        glyphs: { type: "array", items: glyphOutput },
      },
      required: ["icon", "glyphs"],
    },
  },
  {
    name: "get_icon_glyph_by_style",
    title: "Get icon glyph by style",
    description: "Get the web font glyph (unicode character) for an icon in one style. Duotone and twotone icons also have a secondary glyph",
    annotations: { title: "Get icon glyph by style", ...READ_ONLY },
    inputSchema: {
      type: "object",
      properties: { icon_name: iconNameInput, style: styleInput },
      required: ["icon_name", "style"],
    },
    outputSchema: {
      type: "object",
      properties: {
        icon: { type: "string" },
        style: { type: "string" },
        primary: glyphOutput,
        secondary: { anyOf: [glyphOutput, { type: "null" }] },
      },
      required: ["icon", "style", "primary", "secondary"],
    },
  },
];
