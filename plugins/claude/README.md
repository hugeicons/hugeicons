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

## Editing the skills

Edit them in `../../skills`, never here, then run from the repository root:

```bash
python3 plugins/sync-skills.py          # copy the canonical skills into this plugin
python3 plugins/sync-skills.py --check  # exit 1 if these copies are stale
```

A Claude Code plugin installs straight from git, so unlike the OpenAI package these copies are
committed rather than built. That means they can drift: run the script after changing anything
under `../../skills` and commit the result. `--check` is there to catch it in CI. The same
script also syncs [`plugins/grok`](../grok), which ships committed copies for the same reason.

## Validate

```bash
claude plugin validate .                              # plugin manifest
claude plugin validate ../../.claude-plugin/marketplace.json
claude plugin validate ./skills                       # skill frontmatter
```

The marketplace manifest lives at the repository root so the plugin installs from the repo
itself.

## Anthropic's plugin directory

The directory rejects repositories with more than 10,000 files, which this one is well past, so
the listing points at [`hugeicons/claude-plugin`](https://github.com/hugeicons/claude-plugin)
instead. That repository is generated from this folder by
[`../claude-mirror/build.py`](../claude-mirror/build.py) and pushed by the
`claude-plugin-mirror` workflow on every change to `main`. Never edit it by hand. The directory
follows its default branch, so merging here is all it takes to ship an update.
