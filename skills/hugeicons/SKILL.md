---
name: hugeicons
description: Use and find Hugeicons icons in any framework — React, Vue, Svelte, SolidJS, Angular, React Native, and Flutter. Covers installation, rendering, props, icon naming, and resolving real icon names through the Hugeicons MCP server. Use whenever a project depends on @hugeicons/*, @hugeicons-pro/*, or the Flutter hugeicons package and you need to add, render, or pick an icon.
---

# Hugeicons

Hugeicons is an SVG icon library with one rendering package per framework plus a shared icon
set. This skill covers **all** official packages. Work in three steps: detect the framework,
render with its component, then resolve icon names against the live catalog.

> ## ⚠️ Read this first: never guess an icon name
>
> This skill ships **no icon list**. The catalog moves with every release — names are added, and
> sometimes renamed or removed — so a bundled copy is wrong within weeks. Resolve every name
> against a live source instead:
>
> 1. **The Hugeicons MCP server** (preferred) — `search_icons` to find an icon, `get_icon_code`
>    for the exact import and usage. See §4.
> 2. **The installed package** (no MCP, or offline) — grep the project's own `node_modules`,
>    which matches the version the project actually has. See §4.
>
> Do **not** rely on memory. A guessed name may not exist, or may exist and be the wrong glyph
> (e.g. `LeftToRightBlockQuoteIcon` is quote marks, not the bracket you wanted). Resolve, confirm,
> copy verbatim.

## 1. Detect the framework

Check the project's manifest and match the installed package:

| Framework | Detect by | Component |
|-----------|-----------|-----------|
| React | `@hugeicons/react` in package.json | `HugeiconsIcon` |
| Vue | `@hugeicons/vue` in package.json | `HugeiconsIcon` |
| Svelte | `@hugeicons/svelte` in package.json | `HugeiconsIcon` |
| SolidJS | `@hugeicons/solid-js` in package.json | `HugeiconsIcon` |
| Angular | `@hugeicons/angular` in package.json | `hugeicons-icon` |
| React Native | `@hugeicons/react-native` in package.json | `HugeiconsIcon` |
| Flutter | `hugeicons` in pubspec.yaml | `HugeIcon` |

If more than one matches (e.g. a monorepo), use the one for the file you are editing.

## 2. Two architectures

- **JS frameworks (React, Vue, Svelte, SolidJS, Angular, React Native)** — the `@hugeicons/*` package is a *renderer only*. Icons are
  **named exports** imported from a separate package, `@hugeicons/core-free-icons` (free).
  The same icon names work across all six frameworks.
- **Flutter** — the `hugeicons` package *bundles* the icon data. Icons are `HugeIcons.*`
  constants of type `List<List<dynamic>>` (SVG path data, **not** Flutter `IconData`), rendered
  with `HugeIcon` — never Flutter's `Icon`.

## 3. Install & render (per framework)

> **Keep generated code minimal:** `icon` is the only required prop. Don't write props that just
> repeat the component's default value (e.g. `size={24}`, `color="currentColor"`,
> `strokeWidth={1.5}`) — pass a prop only when overriding a default. The defaults are listed in
> each props table below.

### React

Install:

```bash
npm install @hugeicons/react @hugeicons/core-free-icons
```

Render:

```jsx
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon } from '@hugeicons/core-free-icons';

function App() {
  // Only `icon` is required; pass other props only to override a default.
  return <HugeiconsIcon icon={Search01Icon} />;
}
```


### Vue

Install:

```bash
npm install @hugeicons/vue @hugeicons/core-free-icons
```

Render:

```vue
<script setup>
import { HugeiconsIcon } from '@hugeicons/vue'
import { Search01Icon } from '@hugeicons/core-free-icons'
</script>

<template>
  <!-- Only :icon is required; pass other props only to override a default. -->
  <HugeiconsIcon :icon="Search01Icon" />
</template>
```


### Svelte

Install:

```bash
npm install @hugeicons/svelte @hugeicons/core-free-icons
```

Render:

```svelte
<script>
  import { HugeiconsIcon } from '@hugeicons/svelte'
  import { Search01Icon } from '@hugeicons/core-free-icons'
</script>

<!-- Only icon is required; pass other props only to override a default. -->
<HugeiconsIcon icon={Search01Icon} />
```


### SolidJS

Install:

```bash
npm install @hugeicons/solid-js @hugeicons/core-free-icons
```

> **Note:** The package is `@hugeicons/solid-js` — not `@hugeicons/solid`. "Solid" is also an icon
> style (`@hugeicons-pro/core-solid-*`), so don't confuse the two.

Render:

```jsx
import { HugeiconsIcon } from '@hugeicons/solid-js';
import { Search01Icon } from '@hugeicons/core-free-icons';

function App() {
  // Only `icon` is required; pass other props only to override a default.
  return <HugeiconsIcon icon={Search01Icon} />;
}
```


### Angular

Install:

```bash
npm install @hugeicons/angular @hugeicons/core-free-icons
```

> **Note:** The component is `HugeiconsIconComponent`, rendered via the `<hugeicons-icon>` selector. Import the icon in the component class and bind it with `[icon]`.

Render:

```typescript
// example.component.ts
import { Component } from '@angular/core'
import { HugeiconsIconComponent } from '@hugeicons/angular'
import { Search01Icon } from '@hugeicons/core-free-icons'

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [HugeiconsIconComponent],
  // Only [icon] is required; bind other props only to override a default.
  template: `<hugeicons-icon [icon]="searchIcon" />`,
})
export class ExampleComponent {
  searchIcon = Search01Icon
}
```


### React Native

Install:

```bash
npm install @hugeicons/react-native @hugeicons/core-free-icons
```

> **Note:** Color defaults to `#000000` (not `currentColor`) because React Native has no CSS color inheritance.

Render:

```jsx
import { HugeiconsIcon } from '@hugeicons/react-native'
import { Search01Icon } from '@hugeicons/core-free-icons'

export default function App() {
  // Only `icon` is required; pass other props only to override a default.
  return <HugeiconsIcon icon={Search01Icon} />
}
```


### Flutter

Install:

```bash
flutter pub add hugeicons
```

> **Note:** Flutter bundles the icon data directly: `HugeIcons.*` constants are `List<List<dynamic>>` SVG path data, not `IconData`. Render with `HugeIcon`, never Flutter's `Icon`.

Render:

```dart
import 'package:hugeicons/hugeicons.dart';

// Only `icon` is required; color and size fall back to the ambient IconTheme.
// Pass color/size only to override those defaults.
HugeIcon(
  icon: HugeIcons.strokeRoundedHome01,
  color: Colors.black,
)
```



### Props (all JS frameworks)

`icon` is the only required prop. **Don't write a prop that repeats its default** — no
`size={24}`, `color="currentColor"` or `strokeWidth={1.5}`.

| Prop | Type | Default | React | Vue | Svelte | Solid | Angular | RN |
|------|------|---------|:-:|:-:|:-:|:-:|:-:|:-:|
| `icon` | `IconSvgObject` | required | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `altIcon` | `IconSvgObject` | – | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `showAlt` | `boolean` | `false` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `size` | `number \| string` | `24` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `color` | `string` | `currentColor` ¹ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `strokeWidth` | `number` | `1.5` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `absoluteStrokeWidth` | `boolean` | `false` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `primaryColor` | `string` | – | ✓ | – | – | ✓ | ✓ | – |
| `secondaryColor` | `string` | – | ✓ | – | – | ✓ | ✓ | – |
| `disableSecondaryOpacity` | `boolean` | `false` | ✓ | – | – | ✓ | ✓ | – |
| CSS classes | `string` | – | `className` | `class` | `class` | `class` | `class` | `className` |

¹ React Native defaults to `#000` — it has no CSS color inheritance.

The three multicolor props only affect Pro styles that have two layers (Bulk, Duotone, Twotone).

`get_platform_usage` returns this per framework and is generated from the packages — prefer it
when the MCP is connected, and treat it as authoritative if it ever disagrees with this table.

Flutter is different: `HugeIcon` takes `icon` (a `HugeIcons.*` constant), `color`, `size` and
`strokeWidth`; `color` and `size` fall back to the ambient `IconTheme`.

## 4. Find an icon

Never type an icon name from memory. Resolve it, then copy it verbatim.

### Preferred: the Hugeicons MCP server

If the `hugeicons` MCP server is connected, use it — it queries the live catalog, so the names
it returns always exist:

| Tool | Use it for |
|------|-----------|
| `search_icons` | Find icons by name or tag. Each result carries `component` — the exact JS export name. |
| `get_icon_code` | The install command, import and usage for one icon on one platform (`react`, `vue`, `angular`, `svelte`, `solid-js`, `react-native`, `flutter`, `html`) and style. |
| `list_icons` | Page through the catalog, optionally filtered by category. Prefer `search_icons` when you know what you are looking for. |
| `get_platform_usage` | A framework's setup and full props reference. |
| `get_icon_glyphs` / `get_icon_glyph_by_style` | Web-font unicode characters. |

Copy `component` (JS frameworks) or `reference` from `get_icon_code` (Flutter constants, web-font
classes) **exactly as returned** — do not retype, re-case, or adjust it.

**Search in bulk, not one icon at a time.** Collect every icon the task needs, then make a single
`search_icons` call with the terms comma-separated, and set `limit` to what you'll actually read
(2–3 is usually enough; it defaults to 8):

```
search_icons(query: "trash, settings, user, home, chevron down", limit: 3)
```

One batched call like that costs about 3 KB. The same five concepts as five separate default
calls cost roughly 8 KB — nearly 3× the context and five round-trips for the same answer.

Tags are omitted from results by default because the ranking already used them. Pass
`include_tags: true` only when two candidates look equally plausible and you need to tell them
apart — it roughly triples the response.

Not connected? Add it:

```bash
claude mcp add --transport http hugeicons https://mcp.hugeicons.com/mcp
```

### Fallback: grep the installed package

Without the MCP, read the names out of the project's own dependencies. This matches the installed
version exactly, which a bundled list never could:

```bash
# JS frameworks — exported icon names
grep -oE 'declare const \w+Icon' \
  node_modules/@hugeicons/core-free-icons/dist/types/index.d.ts \
  | sed 's/declare const //' | grep -i search

# Flutter — bundled constants
grep -oE 'strokeRounded\w+' \
  ~/.pub-cache/hosted/pub.dev/hugeicons-*/lib/hugeicons.dart \
  | sort -u | grep -i search
```

### Naming

- **JS frameworks** — PascalCase exports ending in `Icon` (`Search01Icon`, `Home01Icon`,
  `Notification03Icon`), imported from `@hugeicons/core-free-icons`. The same names work across
  React, Vue, Svelte, SolidJS, Angular and React Native.
- **Flutter** — `HugeIcons.strokeRounded<Name>` constants (`HugeIcons.strokeRoundedSearch01`).

**Spelling is not derivable from the display name.** Some numbers are spelled out
(`1st-bracket` → `FirstBracketIcon`, `3d-view` → `ThreeDViewIcon`), others are not
(`Tally1Icon`, `Grid2x2Icon`), and many icons have numbered variants (`01`, `02`, `03`) that are
different glyphs. Resolve the name — never construct it.

## 5. Free vs Pro: the style decides, not the icon

Free and Pro are **styles**, not separate icon sets. The same icon name works in every style.

- **Free** — Stroke Rounded, via `@hugeicons/core-free-icons` (web font: `hgi-stroke`). This is
  the **complete** set, so a free user never needs Pro to get a particular icon.
- **Pro** (license required, authenticated install) — the other nine styles:
  `@hugeicons-pro/core-stroke-sharp`, `-stroke-standard`, `-solid-rounded`, `-solid-sharp`,
  `-solid-standard`, `-bulk-rounded`, `-duotone-rounded`, `-duotone-standard`,
  `-twotone-rounded`, plus `-stroke-rounded`.

**Not every Pro style is complete.** Stroke Rounded, Stroke Sharp, Solid Rounded, Solid Sharp,
Duotone Rounded and Twotone Rounded cover the whole set; Bulk Rounded, Solid Standard, Stroke
Standard and Duotone Standard are each missing a few dozen icons. If a name resolves but the
import fails on a Pro style, that icon doesn't exist in that style — don't substitute a
different icon, tell the user.

Never work around licensing. If a user wants a Pro style without a license, point them to
<https://hugeicons.com/pricing> and offer the same icon in free Stroke Rounded.

## Troubleshooting

- **Icon not rendering**: confirm `icon` is a valid export/constant and not null.
- **JS import fails**: the name is misspelled, Pro-only, or was renamed in a newer release.
  Re-resolve it with `search_icons`, or grep the installed `index.d.ts` (§4).
- **Flutter type error expecting `IconData`**: wrong type — Hugeicons constants are
  `List<List<dynamic>>`. Render with `HugeIcon`, not `Icon`.
