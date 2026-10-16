# Hugeicons MCP Server

MCP server for Hugeicons integration and documentation

[![smithery badge](https://smithery.ai/badge/@hugeicons/mcp-server)](https://smithery.ai/server/@hugeicons/mcp-server)

This is a TypeScript-based MCP server that provides tools and resources for integrating Hugeicons into various platforms. It implements a Model Context Protocol (MCP) server that helps AI assistants provide accurate guidance for using Hugeicons.

## Features

### Tools

- `search_icons` - Search icons by name or tags, with exact name and tag matches ranked first. Separate searches with commas to resolve several icons in one call (up to 10 terms; more is an error rather than a silent truncation). `limit` sets results per search (default 8, max 50). Each result includes the icon's JavaScript export name (`component`). Tags are omitted unless `include_tags: true` — they are most of the response and the ranking has already used them
- `get_icon_code` - Get the install command, import and usage snippet for an icon on a platform (`react`, `vue`, `angular`, `svelte`, `solid-js`, `react-native`, `flutter`, `html`) in a `style` (default `stroke-rounded`, the free style), with the exact export name, Flutter constant or web font classes
- `list_icons` - List icon names a page at a time (`offset`, `limit` up to 500), optionally filtered by `category`. The first page also returns every category with its icon count
- `get_platform_usage` - Get platform-specific setup instructions and component props for Hugeicons
- `get_icon_glyphs` - Get all glyphs (unicode characters) for a specific icon across all available styles
- `get_icon_glyph_by_style` - Get the glyph (unicode character) for a specific icon with a particular style

Every tool is read-only (annotated with `readOnlyHint`) and returns `structuredContent` matching its `outputSchema`, with the same JSON as text for older clients. The server also sends `instructions` on initialize describing how the tools fit together.

Icon names are case-insensitive and also accept export and constant names such as `Home01Icon`, `SecondBracketIcon` or `strokeRoundedHome01`. An unknown icon name gets a "did you mean" list of close matches. Unknown icons and invalid arguments come back as tool results with `isError: true`, so the assistant can correct its call.

### Resources

Platform Documentation (in Markdown format), also available through the `hugeicons://docs/platforms/{platform}` resource template:
- `hugeicons://docs/platforms/react` - React integration guide
- `hugeicons://docs/platforms/vue` - Vue integration guide
- `hugeicons://docs/platforms/angular` - Angular integration guide
- `hugeicons://docs/platforms/svelte` - Svelte integration guide
- `hugeicons://docs/platforms/solid-js` - SolidJS integration guide
- `hugeicons://docs/platforms/react-native` - React Native integration guide
- `hugeicons://docs/platforms/flutter` - Flutter integration guide
- `hugeicons://docs/platforms/html` - HTML integration guide (font-based)

Icons Data:
- `hugeicons://icons/index` - Name and category of every icon (JSON format)

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

Run the tests (they build first, and stub the Hugeicons APIs so they run offline):
```bash
npm test
```

## Installation

### Hosted server (no install)

Connect any MCP client that supports remote servers to:

```
https://mcp.hugeicons.com/mcp
```

Claude Code:

```bash
claude mcp add --transport http hugeicons https://mcp.hugeicons.com/mcp
```

In claude.ai, ChatGPT, Cursor and other clients, add a custom connector with the same URL.

### Via Smithery

The hosted server is also listed on [Smithery](https://smithery.ai/server/@hugeicons/mcp-server), which can connect it to your client for you.

### Local (stdio)

If your client only supports local servers, run the npm package instead.

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

### Self-hosting (Streamable HTTP)

`build/http.js` serves the MCP endpoint at `/mcp` and a health check at `/health`. It listens on `PORT` (default `3000`) and runs stateless, so it can be scaled to multiple instances.

```bash
npm run build
PORT=3000 npm run start:http
```

Environment variables:

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `3000` | Port to listen on |
| `HOST` | `0.0.0.0` | Interface to bind |
| `RATE_LIMIT_PER_MINUTE` | `60` | Requests per minute per client IP on `/mcp`. `0` disables it |
| `CLIENT_IP_HEADER` | `x-forwarded-for` | Header holding the client IP, set by your proxy. Use `cf-connecting-ip` behind Cloudflare |

The rate limit is kept in memory per process, so each replica counts separately. Only expose the server through a proxy that sets `CLIENT_IP_HEADER`, since clients can send that header themselves.

The Dockerfile builds the HTTP server and must be built from the repository root:

```bash
docker build -f tools/mcp-server/Dockerfile -t hugeicons-mcp .
docker run -p 3000:3000 hugeicons-mcp
```

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.
