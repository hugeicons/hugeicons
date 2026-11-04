# Hugeicons plugin for Claude

Connects Claude to the Hugeicons MCP server at `https://mcp.hugeicons.com/mcp` and ships the
Hugeicons skills, so Claude resolves real icon names instead of guessing them.

- Searches 6,000+ icons by name or purpose, several at once
- Gives the exact install command, import and usage for React, Vue, Angular, Svelte, SolidJS,
  React Native, Flutter and the web font
- Migrates a project to Hugeicons from lucide-react, Heroicons, react-icons or the deprecated
  hugeicons-react packages

## Install

Add **Hugeicons** from the plugin directory in Claude (Customize → Plugins). In Claude Code you
can also install it from the Hugeicons marketplace:

```bash
claude plugin marketplace add hugeicons/hugeicons
claude plugin install hugeicons@hugeicons
```

## What's here

| File | What it is |
|---|---|
| `.claude-plugin/plugin.json` | Plugin manifest |
| `.mcp.json` | The Hugeicons MCP server, HTTP transport, no authentication |
| `skills/hugeicons/` | Main skill: picks the icon library, installs it and resolves real names |
| `skills/hugeicons-migrate/` | Migrates a project to Hugeicons from another icon library |

## Network and credentials

The plugin calls exactly one endpoint, `https://mcp.hugeicons.com/mcp`, over HTTPS. It needs
**no API key, token or account** and sends no telemetry. Every tool the server exposes is
read-only: searching icons, returning import snippets and returning web font glyphs. The plugin
ships no hooks, scripts or binaries.

## Contributing

This repository is generated from [`hugeicons/hugeicons`](https://github.com/hugeicons/hugeicons)
(`plugins/claude` and `skills/`) and overwritten on every change there, so a commit made here
directly is lost. Please open issues and pull requests in
[`hugeicons/hugeicons`](https://github.com/hugeicons/hugeicons).

## License

MIT. See [LICENSE](LICENSE).
