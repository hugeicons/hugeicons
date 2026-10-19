#!/usr/bin/env python3
"""
Copies the shared skills from ../../skills into this plugin.

Unlike the OpenAI package, a Claude Code plugin installs straight from git, so these
copies have to be committed rather than generated at build time. Run this after editing
anything under ../../skills, and commit the result.

Usage:  python3 sync.py            # copy, reporting what changed
        python3 sync.py --check    # exit 1 if the copies are stale, change nothing
"""

import filecmp, os, shutil, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SOURCE = os.path.abspath(os.path.join(ROOT, "..", "..", "skills"))
SHARED_SKILLS = ["hugeicons", "hugeicons-migrate"]
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
for skill in SHARED_SKILLS:
    src, dst = os.path.join(SOURCE, skill), os.path.join(ROOT, "skills", skill)
    if not os.path.isdir(src):
        print(f"error: {src} does not exist")
        sys.exit(1)

    want = files_under(src)
    have = files_under(dst) if os.path.isdir(dst) else set()
    differs = {f for f in want & have if not filecmp.cmp(os.path.join(src, f), os.path.join(dst, f), shallow=False)}
    changed = sorted((want - have) | (have - want) | differs)

    if not changed:
        print(f"{skill}: up to date")
        continue

    stale.append(skill)
    if CHECK_ONLY:
        print(f"{skill}: STALE ({len(changed)} file(s): {', '.join(changed[:4])}{' ...' if len(changed) > 4 else ''})")
        continue

    shutil.rmtree(dst, ignore_errors=True)
    shutil.copytree(src, dst, ignore=shutil.ignore_patterns(".*"))
    print(f"{skill}: synced {len(changed)} change(s) from {os.path.relpath(src, ROOT)}")

if CHECK_ONLY and stale:
    print(f"\n{len(stale)} skill(s) out of date. Run: python3 sync.py, then commit the result.")
    sys.exit(1)
