# Hugeicons rule for Cursor

`hugeicons.mdc` is a Cursor rule that makes the agent resolve real Hugeicons names, pick the
icon library correctly on a new project, keep one style, and never hand-draw an icon as inline
SVG.

## Install

Copy it into your project:

```bash
mkdir -p .cursor/rules
curl -o .cursor/rules/hugeicons.mdc \
  https://raw.githubusercontent.com/hugeicons/hugeicons/main/plugins/cursor/hugeicons.mdc
```

Then add the Hugeicons MCP server in Cursor's settings, so the agent can look names up:

```
https://mcp.hugeicons.com/mcp
```

The rule works without the MCP server, falling back to grepping the project's installed
package, but name resolution is better with it.

## How it attaches

The frontmatter sets `globs`, so Cursor attaches the rule when the agent works on UI files
(`.tsx`, `.jsx`, `.vue`, `.svelte`, `.astro`, `.html`, `.dart`). `alwaysApply` is `false`, so it
costs nothing on unrelated work. The body is about 760 tokens.

Check it is attaching under Cursor Settings, Rules. If your UI lives in files the globs miss,
edit the `globs` line. Keep the value quoted: a leading `*` is an alias token in YAML, so an
unquoted glob breaks the frontmatter and the rule silently never loads.

## Other agents

The same content works anywhere an agent reads project instructions. For tools that honour
`AGENTS.md`, paste the body (everything after the frontmatter) into that file.

Claude Code and ChatGPT or Codex have proper plugins instead, which carry the full skills rather
than this summary. See [`plugins/claude`](../claude) and [`plugins/openai`](../openai).

## Keeping it current

This file is a condensed version of [`skills/hugeicons`](../../skills/hugeicons), not a generated
copy. If the rules in that skill change, update this file by hand.
