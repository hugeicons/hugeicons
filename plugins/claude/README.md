# Hugeicons plugin for Claude Code

Connects Claude Code to the Hugeicons MCP server at `https://mcp.hugeicons.com/mcp` and ships
the Hugeicons skills, so the agent resolves real icon names instead of guessing them.

## Install

```bash
claude plugin marketplace add hugeicons/hugeicons
claude plugin install hugeicons@hugeicons
```

## What's here

| File | What it is |
|---|---|
| `.claude-plugin/plugin.json` | Plugin manifest |
| `.mcp.json` | The Hugeicons MCP server, HTTP transport, no authentication |
| `skills/hugeicons/` | Main skill. Copied from `../../skills/hugeicons` |
| `skills/hugeicons-migrate/` | Migration skill. Copied from `../../skills/hugeicons-migrate` |
| `sync.py` | Refreshes those copies from `../../skills` |

## Editing the skills

Edit them in `../../skills`, never here, then run:

```bash
python3 sync.py          # copy the canonical skills into this plugin
python3 sync.py --check  # exit 1 if these copies are stale
```

A Claude Code plugin installs straight from git, so unlike the OpenAI package these copies are
committed rather than built. That means they can drift: run `sync.py` after changing anything
under `../../skills` and commit the result. `--check` is there to catch it in CI.

## Validate

```bash
claude plugin validate .                              # plugin manifest
claude plugin validate ../../.claude-plugin/marketplace.json
claude plugin validate ./skills                       # skill frontmatter
```

The marketplace manifest lives at the repository root so the plugin installs from the repo
itself.
