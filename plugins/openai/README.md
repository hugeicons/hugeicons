# Hugeicons plugin package (ChatGPT and Codex)

The Hugeicons plugin for the OpenAI plugin directory. It connects an agent to the Hugeicons
MCP server at `https://mcp.hugeicons.com/mcp` (6 tools, no authentication) and ships the
Hugeicons skills alongside it.

## What's here

| File | What it is |
|---|---|
| `plugin.json` | Listing copy, starter prompts, review test cases, release notes |
| `mcp.json` | The remote MCP server definition |
| `skills/hugeicons/` | Main skill. Generated, synced from `../../skills/hugeicons` |
| `skills/hugeicons-migrate/` | Migration skill. Generated, synced from `../../skills/hugeicons-migrate` |
| `skills/get-started/SKILL.md` | Onboarding skill, run after install |
| `assets/` | Composer icon and logo, light and dark |
| `check.py` | Validates the package, then builds the upload ZIP |

The shared skills are **not** edited here. `check.py` copies them from `../../skills` before
every check and before building the ZIP, so the plugin, the `npx skills add` package and the
MCP server never drift apart. Edit them in `../../skills`.

This package carries no screenshots. OpenAI accepts them only when the MCP tool scan reports a
UI output template, and this server returns text and structured data, so a screenshot is
rejected as `screenshots_not_allowed`.

## Build

```bash
python3 check.py          # validate, then write dist/hugeicons-plugin-<version>.zip
python3 check.py --check  # validate only, build nothing
python3 check.py --test   # local test archive, never upload one of these
```

`check.py` validates the package against OpenAI's plugin rules and refuses to build until
everything passes.

## Updating a published plugin

- Server or tool changes are picked up by OpenAI's daily rescan. No new ZIP needed. Keep the
  tool schemas compatible.
- Listing text or skill changes need a `version` bump in `plugin.json`, a rebuild and a new
  ZIP. This goes through review again.
- The MCP URL cannot be changed after publishing without contacting OpenAI support.
