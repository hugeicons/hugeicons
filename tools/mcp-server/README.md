# Hugeicons MCP Server

MCP server for Hugeicons integration and documentation

[![smithery badge](https://smithery.ai/badge/@hugeicons/mcp-server)](https://smithery.ai/server/@hugeicons/mcp-server)

This is a TypeScript-based MCP server that provides tools and resources for integrating Hugeicons into various platforms. It implements a Model Context Protocol (MCP) server that helps AI assistants provide accurate guidance for using Hugeicons.

## Features

### Tools

- `list_icons` - Get a list of all available Hugeicons icons
- `search_icons` - Search for icons by name or tags
- `get_platform_usage` - Get platform-specific usage instructions for Hugeicons
- `get_icon_glyphs` - Get all glyphs (unicode characters) for a specific icon across all available styles
- `get_icon_glyph_by_style` - Get the glyph (unicode character) for a specific icon with a particular style

### Resources

Platform Documentation (in Markdown format):
- `hugeicons://docs/platforms/react` - React integration guide
- `hugeicons://docs/platforms/vue` - Vue integration guide
- `hugeicons://docs/platforms/angular` - Angular integration guide
- `hugeicons://docs/platforms/svelte` - Svelte integration guide
- `hugeicons://docs/platforms/react-native` - React Native integration guide
- `hugeicons://docs/platforms/flutter` - Flutter integration guide
- `hugeicons://docs/platforms/html` - HTML integration guide (font-based)

Icons Data:
- `hugeicons://icons/index` - Complete index of all Hugeicons (JSON format)

### Functionality

This server provides comprehensive Hugeicons integration support including:
- Icon discovery and search
- Glyph and unicode data retrieval for font-based implementations
- Platform-specific installation guides
- Usage examples with code snippets
- Component props documentation
- Package installation instructions
- Font-based HTML integration via CDN

## Development

Install dependencies:
```bash
npm install
```

Build the server:
```bash
npm run build
```

For development with auto-rebuild:
```bash
npm run watch
```

## Installation

### Installing via Smithery

To install Hugeicons MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@hugeicons/mcp-server):

```bash
npx -y @smithery/cli install @hugeicons/mcp-server --client claude
```

To use with Claude Desktop, add the server config:

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "hugeicons": {
      "command": "npx",
      "args": [
        "-y",
        "@hugeicons/mcp-server"
      ]
    }
  }
}
```

The args array specifies:
1. `-y`: Automatically answer "yes" to npx prompts
2. Package name: `@hugeicons/mcp-server`

### Quick Start

You can also run the server directly using npx:

```bash
npx @hugeicons/mcp-server
```

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.
