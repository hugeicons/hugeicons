![Hugeicons Logo](https://raw.githubusercontent.com/hugeicons/react/main/assets/logo.png)

# @hugeicons/react-native

> Hugeicons React Native rendering library for fast, customizable icons with TypeScript and tree-shaking support

## What is Hugeicons?

Hugeicons is a large icon set for modern web and mobile apps. The free package includes 5,100+ Stroke Rounded icons. The Pro package provides 51,000+ icons across 10 styles.

## How It Works

This package (`@hugeicons/react-native`) is a **rendering library** - it provides the `HugeiconsIcon` component that displays icons in your React Native app. The icons themselves come from separate icon packages:

- **Free icons**: `@hugeicons/core-free-icons` (5,100+ icons)
- **Pro icons**: `@hugeicons-pro/core-*` packages (51,000+ icons, requires license)

### Key Highlights
- **5,100+ Free Icons**: Stroke Rounded set for unlimited personal and commercial projects
- **51,000+ Pro Icons, 10 Styles**: Stroke, Solid, Bulk, Duotone, and Twotone families for sharp, rounded, and standard needs with richer variants
- **Pixel Perfect Grid**: Built on a 24x24 grid for crisp rendering at any size
- **Customizable**: Easily adjust colors, sizes, and styles to match your design needs
- **Tree Shaking Ready**: Named exports keep bundles lean in modern bundlers
- **Regular Updates**: New icons added regularly to keep up with evolving design trends


> **Looking for Pro Icons?** Check out our docs at [hugeicons.com/docs](https://hugeicons.com/docs) for detailed information about pro icons, styles, and advanced usage.

![Hugeicons Icons](https://raw.githubusercontent.com/hugeicons/react/main/assets/icons.png)

## Table of Contents
- [What is Hugeicons?](#what-is-hugeicons)
- [How It Works](#how-it-works)
- [Features](#features)
- [Installation](#installation)
  - [Expo Setup](#expo-setup)
- [Usage](#usage)
- [Props](#props)
- [Examples](#examples)
  - [Basic Usage](#basic-usage)
  - [Custom Size and Color](#custom-size-and-color)
  - [More examples and patterns](#more-examples-and-patterns)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)
- [Platform Support](#platform-support)
- [Related Packages](#related-packages)
- [Pro Version](#pro-version)
- [License](#license)
- [Related](#related)

## Features

- Customizable colors, sizes, and stroke width
- TypeScript support with full type definitions
- Tree shakeable builds (ESM, CJS) for bundlers like Metro
- Native SVG rendering via react-native-svg for optimal performance
- Optimized SVGs for small payloads and fast render
- Alternate icon support for dynamic interactions
- NativeWind support for Tailwind CSS styling

## Installation

```bash
# Using npm
npm install @hugeicons/react-native @hugeicons/core-free-icons react-native-svg

# Using yarn
yarn add @hugeicons/react-native @hugeicons/core-free-icons react-native-svg

# Using pnpm
pnpm add @hugeicons/react-native @hugeicons/core-free-icons react-native-svg

# Using bun
bun add @hugeicons/react-native @hugeicons/core-free-icons react-native-svg
```

Note: This package requires `react-native-svg` as a peer dependency. Some frameworks like Expo handle this automatically. For bare React Native projects, follow the [react-native-svg installation instructions](https://github.com/react-native-svg/react-native-svg#installation).

### Expo Setup

If you're using **Expo** and experiencing issues with TypeScript autocomplete (no icon import suggestions or prop autocomplete), add this to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["@hugeicons/core-free-icons", "@hugeicons/react-native"]
  }
}
```
This is due to Expo's TypeScript configuration using `moduleResolution: "bundler"` which requires explicit type hints for large packages. This is not needed for plain React Native projects.

## Usage

```jsx
import { HugeiconsIcon } from '@hugeicons/react-native';
import { SearchIcon } from '@hugeicons/core-free-icons';

function App() {
  return (
    <HugeiconsIcon
      icon={SearchIcon}
      size={24}
      color="black"
      strokeWidth={1.5}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `IconSvgElement` | Required | The main icon to display |
| `altIcon` | `IconSvgElement` | - | Alternative icon for states, interactions, or dynamic icon swapping |
| `showAlt` | `boolean` | `false` | When true, displays the altIcon instead of the main icon |
| `size` | `number \| string` | `24` | Icon size in pixels |
| `color` | `string` | `black` | Icon color |
| `strokeWidth` | `number` | - | Width of the icon strokes |
| `absoluteStrokeWidth` | `boolean` | `false` | When true, the stroke width will be scaled relative to the icon size |
| `className` | `string` | - | NativeWind classes for styling (requires NativeWind) |

## Examples

### Basic Usage
```jsx
import React from 'react';
import { View } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { SearchIcon } from '@hugeicons/core-free-icons';

function BasicExample() {
  return (
    <View>
      <HugeiconsIcon icon={SearchIcon} />
    </View>
  );
}
```

### Custom Size and Color
```jsx
import React from 'react';
import { View } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { NotificationIcon } from '@hugeicons/core-free-icons';

function CustomExample() {
  return (
    <View>
      <HugeiconsIcon
        icon={NotificationIcon}
        size={32}
        color="#FF5733"
      />
    </View>
  );
}
```

### More examples and patterns

- Examples: https://hugeicons.com/docs/integrations/react-native/examples
- Best practices: https://hugeicons.com/docs/integrations/react-native/best-practices

## Performance

- **Tree-shaking**: The package is fully tree-shakeable, ensuring only the icons you use are included in your final bundle
- **Native SVG Rendering**: Uses react-native-svg for optimal performance
- **Optimized SVGs**: All icons are optimized for size and performance
- **Code Splitting**: Icons can be easily code-split when using dynamic imports

## Troubleshooting

### Common Issues

1. **Icons not showing up?**
   - Make sure you've installed both `@hugeicons/react-native` and `@hugeicons/core-free-icons`
   - Verify that `react-native-svg` is properly installed and linked
   - Check that the icon names are correctly imported

2. **TypeScript errors?**
   - Ensure your `tsconfig.json` includes the necessary type definitions
   - Check that you're using the latest version of the package

3. **Bundle size concerns?**
   - Use named imports instead of importing the entire icon set
   - Implement code splitting for different sections of your app

4. **Android/iOS specific issues?**
   - Make sure you've followed platform-specific setup for react-native-svg
   - Check platform-specific color values are valid

## Platform Support

The library supports both iOS and Android through react-native-svg.

## Related Packages

- [@hugeicons/react](https://www.npmjs.com/package/@hugeicons/react) - React component
- [@hugeicons/vue](https://www.npmjs.com/package/@hugeicons/vue) - Vue component
- [@hugeicons/angular](https://www.npmjs.com/package/@hugeicons/angular) - Angular component
- [@hugeicons/svelte](https://www.npmjs.com/package/@hugeicons/svelte) - Svelte component

## Pro Version

> **Want access to 51,000+ icons and 10 unique styles?**
> Check out our [Pro Version](https://hugeicons.com/pricing) and visit our [docs](https://hugeicons.com/docs) for detailed documentation.

### Available Pro Styles
- **Stroke Styles**
  - Stroke Rounded (`@hugeicons-pro/core-stroke-rounded`)
  - Stroke Sharp (`@hugeicons-pro/core-stroke-sharp`)
  - Stroke Standard (`@hugeicons-pro/core-stroke-standard`)
- **Solid Styles**
  - Solid Rounded (`@hugeicons-pro/core-solid-rounded`)
  - Solid Sharp (`@hugeicons-pro/core-solid-sharp`)
  - Solid Standard (`@hugeicons-pro/core-solid-standard`)
- **Special Styles**
  - Bulk Rounded (`@hugeicons-pro/core-bulk-rounded`)
  - Duotone Rounded (`@hugeicons-pro/core-duotone-rounded`)
  - Duotone Standard (`@hugeicons-pro/core-duotone-standard`)
  - Twotone Rounded (`@hugeicons-pro/core-twotone-rounded`)

## License

The code in this package (`@hugeicons/react-native`) is licensed under the MIT License.

This package only provides rendering utilities. It does not include or grant any rights to Hugeicons icon assets. Using Pro icon styles requires a valid Hugeicons Pro license.

Hugeicons icon packs are licensed separately:
- **Free icon packs**: use the license included with the specific free icon package you install.
- **Pro icon packs (`@hugeicons-pro/*`)**: require a paid Hugeicons Pro license and are governed by the Hugeicons Pro Terms (see [Pro License](PRO-LICENSE.md).).


## Related

- [Changelog](CHANGELOG.md) - Version history and release notes
- [@hugeicons/core-free-icons](https://www.npmjs.com/package/@hugeicons/core-free-icons) - Free icon package
- [Hugeicons Website](https://hugeicons.com) - Browse all available icons
