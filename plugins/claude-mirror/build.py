#!/usr/bin/env python3
"""
Builds the standalone Claude plugin repository (github.com/hugeicons/claude-plugin) from
plugins/claude.

Anthropic's plugin directory rejects any repository with more than 10,000 files, and this
monorepo is well past that, so the directory points at a small repository that holds only the
plugin. That repository is generated: never edit it by hand. Edit the skills in ../../skills
(then run ../sync-skills.py) and the plugin in ../claude, and the claude-plugin-mirror workflow
pushes the result.

Usage:  python3 plugins/claude-mirror/build.py OUT_DIR

OUT_DIR is made to match the plugin exactly: everything in it except .git is replaced, so it
can be a clone of the mirror repository.
"""

import os, shutil, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
PLUGIN = os.path.join(REPO, "plugins", "claude")

# Source path (relative to the repo root) -> path in the mirror.
# plugins/claude/README.md is left out: it describes the plugin's place in this monorepo.
FILES = {
    "plugins/claude/.claude-plugin": ".claude-plugin",
    "plugins/claude/.mcp.json": ".mcp.json",
    "plugins/claude/skills": "skills",
    "plugins/claude-mirror/README.md": "README.md",
    "LICENSE.md": "LICENSE",
}

if len(sys.argv) != 2:
    sys.exit(__doc__.strip())

out = os.path.abspath(sys.argv[1])
os.makedirs(out, exist_ok=True)

for name in os.listdir(out):
    if name == ".git":
        continue
    path = os.path.join(out, name)
    if os.path.isdir(path) and not os.path.islink(path):
        shutil.rmtree(path)
    else:
        os.remove(path)

for src, dst in FILES.items():
    src_path = os.path.join(REPO, src)
    dst_path = os.path.join(out, dst)
    if os.path.isdir(src_path):
        shutil.copytree(src_path, dst_path, ignore=shutil.ignore_patterns(".DS_Store"))
    else:
        shutil.copy2(src_path, dst_path)

print(f"Built the Claude plugin into {out}")
