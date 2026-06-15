![Hugeicons Logo](https://raw.githubusercontent.com/hugeicons/react/main/assets/logo.png)

# @hugeicons/angular

> Hugeicons Angular rendering library for fast, customizable icons with TypeScript and tree-shaking support

## What is Hugeicons?

Hugeicons is a large icon set for modern web and mobile apps. The free package includes 5,100+ Stroke Rounded icons. The Pro package provides 51,000+ icons across 10 styles.

## How It Works

This package (`@hugeicons/angular`) is a **rendering library** - it provides the `HugeiconsIconComponent` that displays icons in your Angular app. The icons themselves come from separate icon packages:

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
- [Usage](#usage)
- [Inputs](#inputs)
- [Examples](#examples)
  - [Basic Usage](#basic-usage)
  - [Custom Size and Color](#custom-size-and-color)
  - [More examples and patterns](#more-examples-and-patterns)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)
- [Browser Support](#browser-support)
- [Related Packages](#related-packages)
- [Pro Version](#pro-version)
- [License](#license)
- [Related](#related)

## Features

- Customizable colors, sizes, and stroke width
- TypeScript support with full type definitions
- Tree shakeable for optimal bundle size
- Standalone component (Angular 17.1+)
- Signal-based inputs for optimal performance
- Alternate icon support for dynamic interactions

## Installation

```bash
# Using npm
npm install @hugeicons/angular @hugeicons/core-free-icons

# Using yarn
yarn add @hugeicons/angular @hugeicons/core-free-icons

# Using pnpm
pnpm add @hugeicons/angular @hugeicons/core-free-icons

# Using bun
bun add @hugeicons/angular @hugeicons/core-free-icons
```

## Usage

The `HugeiconsIconComponent` is a standalone component. Import it directly in your component:

```typescript
import { Component } from '@angular/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { SearchIcon } from '@hugeicons/core-free-icons';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [HugeiconsIconComponent],
  template: `
    <hugeicons-icon
      [icon]="SearchIcon"
      [size]="24"
      color="currentColor"
      [strokeWidth]="1.5"
    />
  `
})
export class ExampleComponent {
  SearchIcon = SearchIcon;
}
```

### NgModule Usage (Legacy)

If you're using NgModules, import the component in your module:

```typescript
import { NgModule } from '@angular/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';

@NgModule({
  imports: [HugeiconsIconComponent],
  // ...
})
export class AppModule { }
```

## Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `icon` | `IconSvgObject` | Required | The main icon to display |
| `altIcon` | `IconSvgObject` | - | Alternative icon for states, interactions, or dynamic icon swapping |
| `showAlt` | `boolean` | `false` | When true, displays the altIcon instead of the main icon |
| `size` | `number \| string` | `24` | Icon size in pixels |
| `color` | `string` | `currentColor` | Icon color (CSS color value) |
| `strokeWidth` | `number` | - | Width of the icon strokes |
| `absoluteStrokeWidth` | `boolean` | `false` | When true, the stroke width will be scaled relative to the icon size |
| `class` | `string` | - | CSS classes to apply to the icon |

## Examples

### Basic Usage
```typescript
import { Component } from '@angular/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { Video01Icon } from '@hugeicons/core-free-icons';

@Component({
  selector: 'app-basic',
  standalone: true,
  imports: [HugeiconsIconComponent],
  template: `
    <hugeicons-icon [icon]="Video01Icon" />
  `
})
export class BasicComponent {
  Video01Icon = Video01Icon;
}
```

### Custom Size and Color
```typescript
import { Component } from '@angular/core';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { Notification02Icon } from '@hugeicons/core-free-icons';

@Component({
  selector: 'app-custom',
  standalone: true,
  imports: [HugeiconsIconComponent],
  template: `
    <hugeicons-icon
      [icon]="Notification02Icon"
      [size]="32"
      color="#FF5733"
    />
  `
})
export class CustomComponent {
  Notification02Icon = Notification02Icon;
}
```

### More examples and patterns

- Examples: https://hugeicons.com/docs/integrations/angular/examples
- Best practices: https://hugeicons.com/docs/integrations/angular/best-practices

## Performance

- **Tree-shaking**: The package is fully tree-shakeable, ensuring only the icons you use are included in your final bundle
- **Optimized SVGs**: All icons are optimized for size and performance
- **Code Splitting**: Icons can be easily code-split when using dynamic imports
- **OnPush Change Detection**: Uses ChangeDetectionStrategy.OnPush for optimal performance

## Troubleshooting

### Common Issues

1. **Icons not showing up?**
   - Make sure you've installed both `@hugeicons/angular` and `@hugeicons/core-free-icons`
   - Check that `HugeiconsIconComponent` is imported in your component or module
   - Verify that icon names are correctly imported

2. **TypeScript errors?**
   - Ensure your `tsconfig.json` includes the necessary type definitions
   - Check that you're using Angular 17.1+ for signal inputs support

3. **Bundle size concerns?**
   - Use named imports instead of importing the entire icon set
   - Implement code splitting for different sections of your app

## Browser Support

The library supports all modern browsers.

## Related Packages

- [@hugeicons/react](https://www.npmjs.com/package/@hugeicons/react) - React component
- [@hugeicons/vue](https://www.npmjs.com/package/@hugeicons/vue) - Vue component
- [@hugeicons/svelte](https://www.npmjs.com/package/@hugeicons/svelte) - Svelte component
- [@hugeicons/react-native](https://www.npmjs.com/package/@hugeicons/react-native) - React Native component

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

The code in this package (`@hugeicons/angular`) is licensed under the MIT License.

This package only provides rendering utilities. It does not include or grant any rights to Hugeicons icon assets. Using Pro icon styles requires a valid Hugeicons Pro license.

Hugeicons icon packs are licensed separately:
- **Free icon packs**: use the license included with the specific free icon package you install.
- **Pro icon packs (`@hugeicons-pro/*`)**: require a paid Hugeicons Pro license and are governed by the Hugeicons Pro Terms (see [Pro License](PRO-LICENSE.md).).


## Related

- [Changelog](CHANGELOG.md) - Version history and release notes
- [@hugeicons/core-free-icons](https://www.npmjs.com/package/@hugeicons/core-free-icons) - Free icon package
- [Hugeicons Website](https://hugeicons.com) - Browse all available icons
