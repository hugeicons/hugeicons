---
name: hugeicons-icons
description: Guidelines for finding and suggesting icons from the Hugeicons package.
---

# Hugeicons Icon Reference

## Guidelines

- **Suggestion Strategy**: When the user needs an icon, first search for a descriptive name in the `references/icon_list.md` file.
- **Naming Conventions**: Icons follow a `strokeRounded<Name>` pattern. For example, for a "user" icon, suggest `HugeIcons.strokeRoundedUser`.
- **Icon Data Type**: `HugeIcons.*` constants are `List<List<dynamic>>` SVG JSON/path data, not Flutter `IconData`. Use them with `HugeIcon`, not `Icon`.
- **Category Browsing**: If the user asks for a category (e.g. "settings", "navigation"), browse the corresponding names in the `icon_list.md`.
- **Multiple Variants**: Many icons have multiple variants (e.g., `01`, `02`, `03`). Suggest the most appropriate one based on context.

## Example Icons

- `HugeIcons.strokeRoundedUser`: Basic user icon.
- `HugeIcons.strokeRoundedSettings01`: Common settings icon.
- `HugeIcons.strokeRoundedHome01`: Standard home icon.
- `HugeIcons.strokeRoundedFavorite`: Heart/favorite icon.

## Reference

The full list of 4,553 icons is available in [icon_list.md](references/icon_list.md). Always check this file for the exact constant name.
