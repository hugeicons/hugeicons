---
name: hugeicons-migrate
description: Migrate a project's icons to Hugeicons — from the deprecated hugeicons-react / @hugeicons/react-pro / hugeicons-react-native packages, from @hugeicons/core-free-icons 4.2 to 4.3, or from lucide-react, @heroicons/react, or react-icons. Use whenever a project imports any of those packages and the task is to switch, replace, upgrade, or migrate icons to Hugeicons, or when you see a deprecated hugeicons-react import in code you are editing.
---

# Migrate to Hugeicons

Companion to the `hugeicons` skill (required — this skill greps its icon catalog). That skill
covers *using* Hugeicons; this one covers *replacing* another icon setup with it, in bulk,
without inventing a single icon name.

> ## ⚠️ Every icon name goes through the catalog
>
> The `hugeicons` skill's `references/icon-list.md` lists every free export (6,000+). It's in the
> sibling skill directory — `../hugeicons/references/icon-list.md` from this folder. Before you
> write a name into code, grep it there and copy the exact match:
>
> ```bash
> grep -i "trash" ../hugeicons/references/icon-list.md
> ```
>
> Never read that file whole, and never emit a name you haven't seen in it. A migration that
> guesses one name breaks the whole build (`Module has no exported member`). **"No confident
> match" is a valid outcome:** leave that call site untouched, list the name as unmapped, and ask
> — do not substitute a look-alike silently.

## 1. Detect the source — from imports, not package.json

Dead dependencies lie; imports don't.

```bash
grep -rnoE "from ['\"](hugeicons-react|@hugeicons/react-pro|hugeicons-react-native|@hugeicons/react-native-pro|lucide-react|@heroicons/react[^'\"]*|react-icons[^'\"]*)['\"]" src | sort | uniq -c
```

| Import matches | Reference to read |
|---|---|
| `hugeicons-react`, `@hugeicons/react-pro`, `hugeicons-react-native`, `@hugeicons/react-native-pro` | [references/legacy-hugeicons.md](references/legacy-hugeicons.md) |
| `@hugeicons/core-free-icons` already, but the build fails on missing exports after an upgrade | [references/legacy-hugeicons.md](references/legacy-hugeicons.md) §5 |
| `lucide-react` | [references/from-lucide.md](references/from-lucide.md) |
| `@heroicons/react/…` | [references/from-heroicons.md](references/from-heroicons.md) |
| `react-icons/…` | [references/from-react-icons.md](references/from-react-icons.md) |

Read only the reference(s) that matched. Each one has the package swap, the prop translation,
and a verified name map for that source.

## 2. The universal rewrite

Whatever the source, the shape of the change is the same: the icon stops being a **component**
and becomes **data** passed to one renderer.

```tsx
// before (any source)
import { Trash2 } from 'lucide-react'
<Trash2 size={20} className="text-red-500" onClick={remove} />

// after
import { HugeiconsIcon } from '@hugeicons/react'
import { TrashIcon } from '@hugeicons/core-free-icons'
<HugeiconsIcon icon={TrashIcon} size={20} className="text-red-500" onClick={remove} />
```

- Renderer: `HugeiconsIcon` from `@hugeicons/react` (or `/react-native`, `/vue`, `/svelte`;
  `<hugeicons-icon>` in Angular). Icons: named exports from `@hugeicons/core-free-icons`.
- `className`, `style`, `onClick`, `aria-*`, `data-*`, `ref` carry over unchanged —
  `HugeiconsIcon` forwards `ref` and spreads unknown props onto the `<svg>`.
- Then apply the minimal-props rule from the `hugeicons` skill: don't write `size={24}`,
  `color="currentColor"` or `strokeWidth={1.5}` — they're the defaults.
- Icon-as-value patterns (`icon: SomeIcon` in a config array, `const Icon = map[name]`) keep
  the same shape; only the render site changes to `<HugeiconsIcon icon={value} />`. The type
  for such values is `IconSvgElement` from `@hugeicons/react`.

## 3. Bulk procedure

Resolve names once, up front — never file by file.

```bash
# 1. distinct icon names in use (adjust the regex per source; the reference file gives it)
grep -rhoE "\b(Fa|Md|Io|Hi|Lu)[A-Z][A-Za-z0-9]*|\b[A-Z][A-Za-z0-9]*Icon\b" src | sort -u > /tmp/src-icons.txt
```

2. Map every name using the source's reference: table → exact/numbered rule → grep the
   catalog by concept. Write the map down (a scratch table in your reply) before editing.
   Anything unresolved goes in an **unmapped** list.
3. If the unmapped list is non-empty, stop and show it with your best candidates for each. Get
   the user's pick. Don't start rewriting with holes in the map.
4. Swap packages (install/uninstall commands are in the reference).
5. Rewrite imports and call sites in every file, applying the map and the prop translation.
6. Verify:

```bash
grep -rnE "from ['\"](hugeicons-react|@hugeicons/react-pro|hugeicons-react-native|lucide-react|@heroicons/react|react-icons)" src   # must be empty
npx tsc --noEmit   # or the project's typecheck
```

A `Module '"@hugeicons/core-free-icons"' has no exported member 'X'` error means a name slipped
through unchecked — fix it via the catalog, not by guessing a variant.

For >20 files, do the rewrite with a script (a codemod or `sed` over the import lines and JSX
tags) rather than by hand, then review the diff. Whatever the tool, step 3 still gates it.

## 4. Style changes to mention once

- **Free is stroke-rounded only.** Migrating from a filled set (heroicons `/solid`, Font
  Awesome, Material) changes the look to 1.5px outlines. Say so once up front; don't try to
  compensate with `strokeWidth`. Filled styles exist in the Pro packages
  (`@hugeicons-pro/core-solid-rounded` etc.) — see the `hugeicons` skill §5.
- **Stroke weight.** Lucide draws at 2px, Hugeicons at 1.5px. Don't add `strokeWidth={2}`
  everywhere unless asked.
- **Default size.** react-icons defaults to `1em`, Hugeicons to `24`. Only icons that relied on
  inheriting `font-size` need `size="1em"`.

## Out of scope

Say so and stop rather than improvising:
- Switching between Hugeicons **styles** (free stroke → Pro solid/duotone) — that's the
  `hugeicons` skill, §5.
- Porting between **frameworks** (React → Vue) — the icon names are identical across the
  `@hugeicons/*` renderers; only the component syntax differs, covered in the `hugeicons` skill.
- **Icon fonts / CSS classes** (`<i class="fa fa-search">`, Material Icons font) — different
  mechanism entirely. The name maps here still help pick icons, but there is no mechanical
  rewrite.

## Troubleshooting

- **`has no exported member 'X'`** — name isn't in the free catalog. Check the renamed table in
  `legacy-hugeicons.md` §5 first (covers legacy 0.x names and the 4.2 → 4.3 renames), then grep.
- **Icon renders but wrong glyph** — a numbered variant was picked blind (`Home03Icon` instead of
  `Home01Icon`). `01` is the canonical one; show the user the alternatives.
- **Pro import fails** — the name exists only in a Pro package or the `.npmrc` auth is missing.
  Never point a free project at `@hugeicons-pro/*`.
- **Icons vanished in React Native** — `react-native-svg` isn't installed; it's a peer dependency.
