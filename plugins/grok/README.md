# Hugeicons plugin for Grok Build

Connects Grok Build to the Hugeicons MCP server at `https://mcp.hugeicons.com/mcp` and ships
the Hugeicons skills, so the agent resolves real icon names instead of guessing them.

## What's here

| File | What it is |
|---|---|
| `.grok-plugin/plugin.json` | Plugin manifest |
| `.mcp.json` | The Hugeicons MCP server, HTTP transport, no authentication |
| `assets/logo.svg` | Marketplace logo |
| `skills/hugeicons/` | Main skill. Copied from `../../skills/hugeicons` |
| `skills/hugeicons-migrate/` | Migration skill. Copied from `../../skills/hugeicons-migrate` |

## Network and credentials

The plugin calls exactly one endpoint, `https://mcp.hugeicons.com/mcp`, over HTTPS. It needs
**no API key, token or account**, reads nothing from the filesystem beyond the project the agent
is already working in, and sends no telemetry. Every tool it exposes is read-only: searching
icons, returning import snippets and returning web font glyphs.

## Editing the skills

Edit them in `../../skills`, never here, then run from the repository root:

```bash
python3 plugins/sync-skills.py          # copy the canonical skills into this plugin
python3 plugins/sync-skills.py --check  # exit 1 if these copies are stale
```

Like the Claude Code plugin, this one installs straight from git, so the copies are committed
rather than built and can drift. `--check` runs in CI to catch that.

## Publishing to the xAI marketplace

The [xAI plugin marketplace](https://github.com/xai-org/plugin-marketplace) is an index, not a
host: a PR adds one entry that points Grok Build at a pinned commit of this repository. Nothing
is vendored there.

The entry to add to `.grok-plugin/marketplace.json` in that repo:

```json
{
  "name": "hugeicons",
  "description": "Hugeicons integration for Grok Build (MCP server + skills). Search 6,000+ icons by meaning, get the exact install command and import for React, Vue, Angular, Svelte, SolidJS, React Native, Flutter and the web font, and migrate a project to Hugeicons from lucide, Heroicons or react-icons.",
  "category": "development",
  "source": {
    "source": "url",
    "url": "https://github.com/hugeicons/hugeicons.git",
    "sha": "<full 40-char commit sha>",
    "path": "plugins/grok"
  },
  "homepage": "https://hugeicons.com",
  "keywords": [
    "hugeicons",
    "hugeicons icons",
    "hugeicons react",
    "hugeicons flutter",
    "hugeicons mcp",
    "hugeicons migrate"
  ],
  "domains": ["hugeicons.com"]
}
```

Before opening the PR:

1. **Pin a real commit**, not `main` or a tag — the validator rejects both, and a moving ref
   would let a later force-push ship new code to every user silently:
   ```bash
   git ls-remote https://github.com/hugeicons/hugeicons.git HEAD
   ```
2. In a fork of the marketplace repo, regenerate the index and validate — this is what CI runs:
   ```bash
   python3 scripts/generate-plugin-index.py
   python3 scripts/validate-catalog.py
   python3 scripts/generate-plugin-index.py --check
   ```

**Keywords must stay brand-scoped.** They drive Grok Build's plugin CTA — the prompt that
proactively suggests this plugin — so generic terms like `icons`, `ui` or `react` get pushed
back in review for misfiring on unrelated requests. This is the opposite of the Claude Code
plugin, whose keywords are deliberately generic for marketplace search. Don't copy one to the
other.

**To update a published plugin,** bump `version` in `.grok-plugin/plugin.json` and merge. A
daily job in the marketplace repo moves the pinned `sha` to our latest commit whenever `version`
changes, and leaves it alone when it doesn't, so a merge without a version bump never ships.
Never open a second entry.

## Validate locally

```bash
python3 -c "import json; json.load(open('.grok-plugin/plugin.json')); json.load(open('.mcp.json'))"
```

The format matches the Claude Code plugin closely enough that
[`claude plugin validate`](https://docs.claude.com/en/docs/claude-code/plugins) is a useful
second opinion on the skills:

```bash
claude plugin validate ./skills
```
