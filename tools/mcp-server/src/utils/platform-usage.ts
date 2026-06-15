export type Platform = 'react' | 'vue' | 'angular' | 'svelte' | 'react-native' | 'flutter' | 'html';

export interface PlatformUsage {
  platform: Platform;
  installation: {
    core: string;
    packages: string[];
  };
  basicUsage: string;
  props?: {
    name: string;
    type: string;
    default?: string;
    description: string;
  }[];
}

// Free package that's always available
const FREE_PACKAGE = '@hugeicons/core-free-icons';

// Pro packages that require authentication via .npmrc or similar package manager config
const PRO_PACKAGES = [
  '@hugeicons-pro/core-stroke-rounded',
  '@hugeicons-pro/core-stroke-sharp',
  '@hugeicons-pro/core-stroke-standard',
  '@hugeicons-pro/core-solid-rounded',
  '@hugeicons-pro/core-solid-sharp',
  '@hugeicons-pro/core-solid-standard',
  '@hugeicons-pro/core-bulk-rounded',
  '@hugeicons-pro/core-duotone-rounded',
  '@hugeicons-pro/core-duotone-standard',
  '@hugeicons-pro/core-twotone-rounded'
];

// All available packages - pro packages require authentication
const CORE_PACKAGES = [FREE_PACKAGE, ...PRO_PACKAGES];

// Note: Pro packages (@hugeicons-pro/*) require authentication via .npmrc or similar package manager config files
// with the appropriate registry token. Without authentication, only the free package (@hugeicons/core-free-icons)
// will be accessible.

export const PLATFORM_USAGE: Record<Platform, PlatformUsage> = {
  'react': {
    platform: 'react',
    installation: {
      core: 'npm install @hugeicons/react',
      packages: CORE_PACKAGES
    },
    basicUsage: `import { HugeiconsIcon } from '@hugeicons/react'
// Using free icons (available by default)
import { Notification03Icon } from '@hugeicons/core-free-icons'
// Pro icons require authentication via .npmrc or similar config
// import { Notification03Icon } from '@hugeicons-pro/core-stroke-rounded'

function App() {
    return <HugeiconsIcon icon={Notification03Icon} size={24} color="currentColor" strokeWidth={1.5} />
}`,
    props: [
      { name: 'icon', type: 'IconSvgObject', default: 'Required', description: 'The main icon component imported from an icon package' },
      { name: 'altIcon', type: 'IconSvgObject', description: 'Alternative icon component from an icon package for states, interactions, or animations' },
      { name: 'showAlt', type: 'boolean', default: 'false', description: 'When true, displays the altIcon instead of the main icon' },
      { name: 'size', type: 'number', default: '24', description: 'Icon size in pixels' },
      { name: 'color', type: 'string', default: 'currentColor', description: 'Icon color (CSS color value)' },
      { name: 'strokeWidth', type: 'number', default: '1.5', description: 'Width of the icon strokes (works with stroke-style icons)' },
      { name: 'className', type: 'string', description: 'Additional CSS classes' }
    ]
  },
  'vue': {
    platform: 'vue',
    installation: {
      core: 'npm install @hugeicons/vue',
      packages: CORE_PACKAGES
    },
    basicUsage: `<script setup>
import { HugeiconsIcon } from '@hugeicons/vue'
// Using free icons (available by default)
import { Notification03Icon } from '@hugeicons/core-free-icons'
// Pro icons require authentication via .npmrc or similar config
// import { Notification03Icon } from '@hugeicons-pro/core-stroke-rounded'
</script>

<template>
    <HugeiconsIcon :icon="Notification03Icon" :size="24" color="currentColor" :strokeWidth="1.5" />
</template>`,
    props: [
      { name: 'icon', type: 'IconSvgObject', default: 'Required', description: 'The main icon component imported from an icon package' },
      { name: 'altIcon', type: 'IconSvgObject', description: 'Alternative icon component from an icon package for states, interactions, or animations' },
      { name: 'showAlt', type: 'boolean', default: 'false', description: 'When true, displays the altIcon instead of the main icon' },
      { name: 'size', type: 'number', default: '24', description: 'Icon size in pixels' },
      { name: 'color', type: 'string', default: 'currentColor', description: 'Icon color (CSS color value)' },
      { name: 'strokeWidth', type: 'number', default: '1.5', description: 'Width of the icon strokes (works with stroke-style icons)' },
      { name: 'class', type: 'string', description: 'Additional CSS classes' }
    ]
  },
  'angular': {
    platform: 'angular',
    installation: {
      core: 'npm install @hugeicons/angular',
      packages: CORE_PACKAGES
    },
    basicUsage: `// your.component.ts
import { Component } from '@angular/core'
// Using free icons (available by default)
import { Notification03Icon } from '@hugeicons/core-free-icons'
// Pro icons require authentication via .npmrc or similar config
// import { Notification03Icon } from '@hugeicons-pro/core-stroke-rounded'

@Component({
    selector: 'app-example',
    template: \` <hugeicons-icon [icon]="notification03Icon" [size]="24" color="currentColor" [strokeWidth]="1.5"></hugeicons-icon> \`,
})
export class ExampleComponent {
    notification03Icon = Notification03Icon
}`,
    props: [
      { name: 'icon', type: 'IconSvgObject', default: 'Required', description: 'The main icon component imported from an icon package' },
      { name: 'altIcon', type: 'IconSvgObject', description: 'Alternative icon component from an icon package for states, interactions, or animations' },
      { name: 'showAlt', type: 'boolean', default: 'false', description: 'When true, displays the altIcon instead of the main icon' },
      { name: 'size', type: 'number', default: '24', description: 'Icon size in pixels' },
      { name: 'color', type: 'string', default: 'currentColor', description: 'Icon color (CSS color value)' },
      { name: 'strokeWidth', type: 'number', default: '1.5', description: 'Width of the icon strokes (works with stroke-style icons)' },
      { name: 'class', type: 'string', description: 'Additional CSS classes' }
    ]
  },
  'svelte': {
    platform: 'svelte',
    installation: {
      core: 'npm install @hugeicons/svelte',
      packages: CORE_PACKAGES
    },
    basicUsage: `<script>
  import { HugeiconsIcon } from '@hugeicons/svelte'
  // Using free icons (available by default)
  import { Notification03Icon } from '@hugeicons/core-free-icons'
  // Pro icons require authentication via .npmrc or similar config
  // import { Notification03Icon } from '@hugeicons-pro/core-stroke-rounded'
</script>

<HugeiconsIcon icon={Notification03Icon} size={24} color="currentColor" strokeWidth={1.5} />`,
    props: [
      { name: 'icon', type: 'IconSvgObject', default: 'Required', description: 'The main icon component imported from an icon package' },
      { name: 'altIcon', type: 'IconSvgObject', description: 'Alternative icon component from an icon package for states, interactions, or animations' },
      { name: 'showAlt', type: 'boolean', default: 'false', description: 'When true, displays the altIcon instead of the main icon' },
      { name: 'size', type: 'number', default: '24', description: 'Icon size in pixels' },
      { name: 'color', type: 'string', default: 'currentColor', description: 'Icon color (CSS color value)' },
      { name: 'strokeWidth', type: 'number', default: '1.5', description: 'Width of the icon strokes (works with stroke-style icons)' },
      { name: 'class', type: 'string', description: 'Additional CSS classes' }
    ]
  },
  'react-native': {
    platform: 'react-native',
    installation: {
      core: 'npm install @hugeicons/react-native',
      packages: CORE_PACKAGES
    },
    basicUsage: `import { HugeiconsIcon } from '@hugeicons/react-native'
// Using free icons (available by default)
import { Notification03Icon } from '@hugeicons/core-free-icons'
// Pro icons require authentication via .npmrc or similar config
// import { Notification03Icon } from '@hugeicons-pro/core-stroke-rounded'

export default function App() {
  return <HugeiconsIcon icon={Notification03Icon} size={24} color="#000000" strokeWidth={1.5} />
}`,
    props: [
      { name: 'icon', type: 'IconSvgObject', default: 'Required', description: 'The main icon component imported from an icon package' },
      { name: 'altIcon', type: 'IconSvgObject', description: 'Alternative icon component from an icon package for states, interactions, or animations' },
      { name: 'showAlt', type: 'boolean', default: 'false', description: 'When true, displays the altIcon instead of the main icon' },
      { name: 'size', type: 'number', default: '24', description: 'Icon size in pixels' },
      { name: 'color', type: 'string', default: '#000000', description: 'Icon color (color string)' },
      { name: 'strokeWidth', type: 'number', default: '1.5', description: 'Width of the icon strokes (works with stroke-style icons)' }
    ]
  },
  'flutter': {
    platform: 'flutter',
    installation: {
      core: 'hugeicons: ^0.0.10',
      packages: []
    },
    basicUsage: `import 'package:hugeicons/hugeicons.dart';

// Example usage in a widget
HugeIcon(
  icon: HugeIcons.strokeRoundedHome01,
  color: Colors.red,
  size: 30.0,
),`,
    props: [
      { name: 'icon', type: 'HugeIcons', default: 'Required', description: 'The icon to display from HugeIcons collection' },
      { name: 'size', type: 'double', default: '24.0', description: 'Icon size in logical pixels' },
      { name: 'color', type: 'Color', default: 'Colors.black', description: 'Icon color from Flutter Colors' }
    ]
  },
  'html': {
    platform: 'html',
    installation: {
      core: 'CDN Link: https://use.hugeicons.com/font/icons.css',
      packages: []
    },
    basicUsage: `<!DOCTYPE html>
<html>
    <head>
        <title>Hugeicons Example</title>
        <meta charset="UTF-8" />
        <link rel="stylesheet" href="https://use.hugeicons.com/font/icons.css" />
    </head>
    <body>
        <div class="icons">
            <ul>
                <li>
                    <i class="hgi-stroke hgi-abacus"></i>
                    <p>abacus</p>
                </li>
                <li>
                    <i class="hgi-stroke hgi-absolute"></i>
                    <p>absolute</p>
                </li>
                <li>
                    <i class="hgi-stroke hgi-acceleration"></i>
                    <p>acceleration</p>
                </li>
                <li>
                    <i class="hgi-stroke hgi-access"></i>
                    <p>access</p>
                </li>
            </ul>
        </div>
    </body>
</html>`,
    props: [
      { name: 'class', type: 'string', default: 'hgi-stroke', description: 'Base CSS class for stroke-style icons' },
      { name: 'icon-name', type: 'string', default: 'Required', description: 'Specific icon class name (e.g., hgi-abacus, hgi-absolute)' },
      { name: 'style', type: 'CSS properties', description: 'Custom CSS styles for size, color, etc.' }
    ]
  }
}; 