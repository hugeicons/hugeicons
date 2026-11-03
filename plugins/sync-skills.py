#!/usr/bin/env python3
"""
Copies the shared skills from ../skills into every plugin that ships committed copies.

The OpenAI package builds its copies at package time and gitignores them. The Claude Code
and Grok Build plugins both install straight from git, so their copies have to be committed
instead — which means they can drift. Run this after editing anything under ../skills, and
commit the result.

Usage:  python3 plugins/sync-skills.py            # copy, reporting what changed
        python3 plugins/sync-skills.py --check    # exit 1 if any copy is stale, change nothing
"""

import filecmp, os, shutil, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SOURCE = os.path.abspath(os.path.join(ROOT, "..", "skills"))
SHARED_SKILLS = ["hugeicons", "hugeicons-migrate"]
TARGETS = ["claude", "grok"]
CHECK_ONLY = "--check" in sys.argv


def files_under(path):
    """Every file in a skill directory, as paths relative to it. Dotfiles are not skill content."""
    found = set()
    for dirpath, dirnames, filenames in os.walk(path):
        dirnames[:] = [d for d in dirnames if not d.startswith(".")]
        for name in filenames:
            if name.startswith("."):
                continue
            found.add(os.path.relpath(os.path.join(dirpath, name), path))
    return found


stale = []
for target in TARGETS:
    for skill in SHARED_SKILLS:
        src = os.path.join(SOURCE, skill)
        dst = os.path.join(ROOT, target, "skills", skill)
        label = f"{target}/{skill}"
        if not os.path.isdir(src):
            print(f"error: {src} does not exist")
            sys.exit(1)

        want = files_under(src)
        have = files_under(dst) if os.path.isdir(dst) else set()
        differs = {f for f in want & have if not filecmp.cmp(os.path.join(src, f), os.path.join(dst, f), shallow=False)}
        changed = sorted((want - have) | (have - want) | differs)

        if not changed:
            print(f"{label}: up to date")
            continue

        stale.append(label)
        if CHECK_ONLY:
            print(f"{label}: STALE ({len(changed)} file(s): {', '.join(changed[:4])}{' ...' if len(changed) > 4 else ''})")
            continue

        shutil.rmtree(dst, ignore_errors=True)
        shutil.copytree(src, dst, ignore=shutil.ignore_patterns(".*"))
        print(f"{label}: synced {len(changed)} change(s)")

if CHECK_ONLY and stale:
    print(f"\n{len(stale)} copy/copies out of date. Run: python3 plugins/sync-skills.py, then commit the result.")
    sys.exit(1)
