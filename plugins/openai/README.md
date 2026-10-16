# Hugeicons plugin package (ChatGPT / Codex directory)

Package for the OpenAI plugin directory, built against the live server at `https://mcp.hugeicons.com/mcp` (6 tools, no auth).

The main skill is **not** stored here. `check.py` copies it from `../../skills/hugeicons` before every check and before building the ZIP, so the plugin, the `npx skills add` package and the MCP server never drift apart. All icon names used in the test cases were checked against the live server on 15 Oct 2026.

## What's here

| File | What it is | Status |
|---|---|---|
| `plugin.json` | Listing copy, starter prompts, 5 + 3 review test cases, release notes | Ready. Add the video link |
| `mcp.json` | The one remote MCP server | Ready |
| `skills/hugeicons/` | Main skill. **Synced from `../../skills/hugeicons` by `check.py`** — edit it there, never here | Generated |
| `skills/hugeicons-migrate/` | Migration skill. **Synced from `../../skills/hugeicons-migrate`** | Generated |
| `skills/get-started/SKILL.md` | Onboarding skill run after install | Ready |
| `assets/icon*.png`, `assets/logo*.png` | Real artwork (one mark, light and dark use the same file) | Done |

No screenshots: OpenAI allows them only when the MCP tool scan reports a UI output template. This server returns text and structured data, so including one is rejected as `screenshots_not_allowed`.
| `check.py` | Checks everything against OpenAI's rules, then builds the upload ZIP | Ready |

## To finish (in order)

1. **Artwork** (design team), same file names in `assets/`:
   - `logo.png`, `logo-dark.png`: square, at least 48 px (512 px recommended), PNG/SVG/WebP, under 5 MB
   - `icon.png`, `icon-dark.png`: the composer icon, square, same rules
   - `screenshot-1.png`: Hugeicons working inside ChatGPT or Codex. Add more and list them in `plugin.json`, or remove the `screenshots` line.
   - Optional: add `"brandColor": "#RRGGBB"` in `plugin.json` (needs 2:1 contrast on white).
2. **Server fixes** before recording the video:
   - Add `readOnlyHint: true`, `destructiveHint: false` annotations to all 5 tools
   - Make sure the rate limit doesn't throttle OpenAI's shared egress IPs
   - Make sure Cloudflare bot protection doesn't block OpenAI's scanner
3. **Video**: record the 8 test cases (in `plugin.json` → `review.test_cases`) running in ChatGPT with the server connected through developer mode. Upload it somewhere reviewers can open without signing in. Add the link as `"demo_recording_url"` inside `review` in `plugin.json`.
4. **Support URL**: `plugin.json` uses `https://hugeicons.com/faq/general`. Swap in a real support or contact page if you have one.
5. **Build**: `python3 check.py`. It lists anything still missing. When everything passes it writes `dist/hugeicons-plugin-1.0.0.zip`.

## Submit

1. OpenAI platform → organization settings: complete **business verification**. The submitter needs org owner or Apps Management Write.
2. [platform.openai.com/plugins](https://platform.openai.com/plugins) → **Upload new or existing plugin** → choose the verified identity → upload the ZIP.
3. **Metadata & Skills**: fix any findings, edit the files here, rebuild, re-upload.
4. **MCPs → Connect**: auth none. For domain verification, serve the token the portal shows as plain text at `https://mcp.hugeicons.com/.well-known/openai-apps-challenge`. Wait for the tool scan and fix findings.
5. **Submit for review** and accept the attestations. Feedback arrives by email.
6. After approval, click **Publish** when you're ready to announce.

## Later updates

- Server or tool changes: picked up by OpenAI's daily rescan. No new ZIP needed. Keep the tool schemas compatible.
- Listing text or skill changes: bump `version` in `plugin.json`, run `check.py`, upload the new ZIP. This goes through review again.
- The MCP URL can't be changed after publishing without contacting OpenAI support.
