---
name: hugeicons-usage
description: Guidelines for using the Hugeicons Flutter package, covering widget usage, customization, and theme integration.
---

# Hugeicons Usage Guide

## Core Guidelines

- **Use the `HugeIcon` widget**: Always use the provided `HugeIcon` widget for rendering icons.
- **Icon Data Type**: `HugeIcon.icon` expects `List<List<dynamic>>`. `HugeIcons.*` constants are SVG JSON/path data, not Flutter `IconData`.
- **Do Not Use `Icon`**: Do not render `HugeIcons.*` constants with Flutter's `Icon` widget. Pass them to `HugeIcon`.
- **Icon Constants**: Icons are accessed through the `HugeIcons` class (e.g., `HugeIcons.strokeRoundedUser`).
- **Theme Color Inheritance**: By default, `HugeIcon` inherits the color from the current `IconTheme`. You can override this using the `color` property.
- **Size**: The default size is 24.0. Use the `size` property to scale the icon.
- **Stroke Width**: For stroke-based icons (most icons in this package), you can customize the thickness using the `strokeWidth` property.

## Examples

### Simple Usage
```dart
HugeIcon(
  icon: HugeIcons.strokeRoundedHome01,
  color: Colors.black,
  size: 24.0,
)
```

### With Color Inheritance
```dart
IconTheme(
  data: IconThemeData(color: Colors.blue, size: 32.0),
  child: HugeIcon(
    icon: HugeIcons.strokeRoundedSettings01,
  ),
)
```

### Custom Stroke Width
```dart
HugeIcon(
  icon: HugeIcons.strokeRoundedFavorite,
  color: Colors.red,
  strokeWidth: 2.5,
)
```

## Troubleshooting

- **Icon not showing**: Ensure the `icon` property is not null and is a valid constant from `HugeIcons`.
- **Type errors**: If code expects `IconData`, it is using the wrong type. Hugeicons icon constants are `List<List<dynamic>>`.
- **Unexpected Color**: Check if a parent `IconTheme` or `DefaultTextStyle` is providing a color you don't expect.
