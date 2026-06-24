---
name: hugeicons
description: Use and find Hugeicons icons in any framework — React, Vue, Svelte, Angular, React Native, and Flutter. Covers installation, rendering, props, icon naming, and the full icon catalog. Use whenever a project depends on @hugeicons/*, @hugeicons-pro/*, or the Flutter hugeicons package and you need to add, render, or pick an icon.
---

# Hugeicons

Hugeicons is an SVG icon library with one rendering package per framework plus a shared icon
set. This skill covers **all** official packages. Work in three steps: detect the framework,
render with its component, then pick icon names from the right catalog.

> ## ⚠️ Read this first: grep the icon lists, never read them whole
>
> The reference files under `references/` list **thousands** of icons and run tens of thousands
> of tokens each. **Never open one in full** — always `grep` for a keyword and copy the exact
> match:
>
> ```bash
> grep -i search references/icon-list.md          # JS frameworks
> grep -i home   references/icon-list-flutter.md   # Flutter
> ```
>
> Do **not** rely on memory for icon names — a guessed name may not exist, or may exist but be
> the wrong glyph (e.g. `LeftToRightBlockQuoteIcon` is quote marks, not the bracket you wanted).
> Grep, confirm, copy.

## 1. Detect the framework

Check the project's manifest and match the installed package:

| Framework | Detect by | Component |
|-----------|-----------|-----------|
| React | `@hugeicons/react` in package.json | `HugeiconsIcon` |
| Vue | `@hugeicons/vue` in package.json | `HugeiconsIcon` |
| Svelte | `@hugeicons/svelte` in package.json | `HugeiconsIcon` |
| Angular | `@hugeicons/angular` in package.json | `hugeicons-icon` |
| React Native | `@hugeicons/react-native` in package.json | `HugeiconsIcon` |
| Flutter | `hugeicons` in pubspec.yaml | `HugeIcon` |

If more than one matches (e.g. a monorepo), use the one for the file you are editing.

## 2. Two architectures

- **JS frameworks (React, Vue, Svelte, Angular, React Native)** — the `@hugeicons/*` package is a *renderer only*. Icons are
  **named exports** imported from a separate package, `@hugeicons/core-free-icons` (free).
  The same icon names work across all five frameworks.
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

Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `IconSvgElement` | Required | The main icon to display (a named export from an icon package) |
| `altIcon` | `IconSvgElement` | - | Alternative icon for states, interactions, or dynamic swapping |
| `showAlt` | `boolean` | false | When true, displays `altIcon` instead of `icon` |
| `size` | `number \| string` | 24 | Icon size in pixels |
| `color` | `string` | currentColor | Icon color (any CSS color value) |
| `strokeWidth` | `number` | 1.5 | Width of the icon strokes |
| `absoluteStrokeWidth` | `boolean` | false | When true, stroke width is scaled relative to icon size |
| `primaryColor` | `string` | - | Primary color for multicolor Pro icons (Bulk, Duotone, Twotone) |
| `secondaryColor` | `string` | - | Secondary color for multicolor Pro icons |
| `disableSecondaryOpacity` | `boolean` | false | Disables default opacity applied to the secondary color |
| `className` | `string` | - | Additional CSS classes |

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

Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `IconSvgObject` | Required | The main icon to display (a named export from an icon package) |
| `altIcon` | `IconSvgObject` | - | Alternative icon for states, interactions, or animations |
| `showAlt` | `boolean` | false | When true, displays `altIcon` instead of `icon` |
| `size` | `number` | 24 | Icon size in pixels |
| `color` | `string` | currentColor | Icon color (any CSS color value) |
| `strokeWidth` | `number` | 1.5 | Width of the icon strokes |
| `class` | `string` | - | Additional CSS classes |

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

Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `IconSvgObject` | Required | The main icon to display (a named export from an icon package) |
| `altIcon` | `IconSvgObject` | - | Alternative icon for states, interactions, or animations |
| `showAlt` | `boolean` | false | When true, displays `altIcon` instead of `icon` |
| `size` | `number` | 24 | Icon size in pixels |
| `color` | `string` | currentColor | Icon color (any CSS color value) |
| `strokeWidth` | `number` | 1.5 | Width of the icon strokes |
| `class` | `string` | - | Additional CSS classes |

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

Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `IconSvgObject` | Required | The main icon to display (a named export from an icon package) |
| `altIcon` | `IconSvgObject` | - | Alternative icon for states, interactions, or animations |
| `showAlt` | `boolean` | false | When true, displays `altIcon` instead of `icon` |
| `size` | `number` | 24 | Icon size in pixels |
| `color` | `string` | currentColor | Icon color (any CSS color value) |
| `strokeWidth` | `number` | 1.5 | Width of the icon strokes |
| `class` | `string` | - | Additional CSS classes |

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

Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `IconSvgObject` | Required | The main icon to display (a named export from an icon package) |
| `altIcon` | `IconSvgObject` | - | Alternative icon for states, interactions, or animations |
| `showAlt` | `boolean` | false | When true, displays `altIcon` instead of `icon` |
| `size` | `number` | 24 | Icon size in pixels |
| `color` | `string` | #000000 | Icon color (color string) |
| `strokeWidth` | `number` | 1.5 | Width of the icon strokes |

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

Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `List<List<dynamic>>` | Required | The icon data (a `HugeIcons.*` constant) — NOT a Flutter `IconData` |
| `color` | `Color` | IconTheme color | Icon color; falls back to the ambient `IconTheme` |
| `size` | `double` | 24.0 | Icon size in logical pixels; falls back to `IconTheme` size |
| `strokeWidth` | `double` | - | Stroke thickness for stroke-style icons |


## 4. Find an icon

- **React, Vue, Svelte, Angular, React Native** — PascalCase named exports ending in `Icon` (e.g. `Search01Icon`, `Home01Icon`,
  `Notification03Icon`). Number words are spelled out: `1st-bracket` → `FirstBracketIcon`,
  `3d-view` → `ThreeDViewIcon`. Import from `@hugeicons/core-free-icons`.
  Full list: [references/icon-list.md](references/icon-list.md) (5,471 icons).
- **Flutter** — `HugeIcons.strokeRounded<Name>` constants (e.g. `HugeIcons.strokeRoundedSearch01`).
  Full list: [references/icon-list-flutter.md](references/icon-list-flutter.md) (4,547 icons).

**Grep these files — don't read them whole** (see the warning at the top). Search for a term,
copy the **exact** matching name, and don't guess: many icons have numbered variants (`01`, `02`,
`03`) — pick the one that best fits.

## 5. Free vs Pro icons

- **Free** (default): `@hugeicons/core-free-icons` — 5,100+ stroke-rounded icons. Suggest only these
  unless the user has a Pro license.
- **Pro** (license required, authenticated install): `@hugeicons-pro/core-stroke-rounded`, `@hugeicons-pro/core-stroke-sharp`, `@hugeicons-pro/core-stroke-standard`, `@hugeicons-pro/core-solid-rounded`, `@hugeicons-pro/core-solid-sharp`, `@hugeicons-pro/core-solid-standard`, `@hugeicons-pro/core-bulk-rounded`, `@hugeicons-pro/core-duotone-rounded`, `@hugeicons-pro/core-duotone-standard`, `@hugeicons-pro/core-twotone-rounded`.

Never suggest a Pro-only icon to a free user — the import will fail.

## Troubleshooting

- **Icon not rendering**: confirm `icon` is a valid export/constant and not null.
- **JS import fails**: the name is misspelled or Pro-only. Check the exact export in
  `references/icon-list.md`.
- **Flutter type error expecting `IconData`**: wrong type — Hugeicons constants are
  `List<List<dynamic>>`. Render with `HugeIcon`, not `Icon`.
