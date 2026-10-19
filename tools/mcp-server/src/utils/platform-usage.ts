export type Platform = 'react' | 'vue' | 'angular' | 'svelte' | 'solid-js' | 'react-native' | 'flutter' | 'html';

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

/**
 * Props the JavaScript renderers accept, read from the component prop types in
 * packages/<framework>/src. Composed from one definition so a prop can't be documented
 * for one framework and quietly missing from another.
 */
function jsProps(opts: { classProp: string; colorDefault?: string; multicolor?: boolean }) {
  const props = [
    { name: 'icon', type: 'IconSvgObject', default: 'Required', description: 'The icon to render (a named export from an icon package)' },
    { name: 'altIcon', type: 'IconSvgObject', description: 'Alternative icon for states, interactions or dynamic swapping' },
    { name: 'showAlt', type: 'boolean', default: 'false', description: 'When true, displays altIcon instead of icon' },
    { name: 'size', type: 'number | string', default: '24', description: 'Icon size in pixels' },
    { name: 'color', type: 'string', default: opts.colorDefault ?? 'currentColor', description: 'Icon color (any CSS color value)' },
    { name: 'strokeWidth', type: 'number', default: '1.5', description: 'Width of the icon strokes (stroke styles only)' },
    { name: 'absoluteStrokeWidth', type: 'boolean', default: 'false', description: 'When true, stroke width stays constant instead of scaling with size' },
  ];
  if (opts.multicolor) {
    props.push(
      { name: 'primaryColor', type: 'string', description: 'Primary color for multicolor Pro styles (Bulk, Duotone, Twotone)' },
      { name: 'secondaryColor', type: 'string', description: 'Secondary color for multicolor Pro styles' },
      { name: 'disableSecondaryOpacity', type: 'boolean', default: 'false', description: 'Disables the default opacity applied to the secondary color' },
    );
  }
  props.push({ name: opts.classProp, type: 'string', description: 'Additional CSS classes' });
  return props;
}

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
    return <HugeiconsIcon icon={Notification03Icon} />
}`,
    props: jsProps({ classProp: 'className', multicolor: true })
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
    <HugeiconsIcon :icon="Notification03Icon" />
</template>`,
    props: jsProps({ classProp: 'class' })
  },
  'angular': {
    platform: 'angular',
    installation: {
      core: 'npm install @hugeicons/angular',
      packages: CORE_PACKAGES
    },
    basicUsage: `// your.component.ts
import { Component } from '@angular/core'
import { HugeiconsIconComponent } from '@hugeicons/angular'
// Using free icons (available by default)
import { Notification03Icon } from '@hugeicons/core-free-icons'
// Pro icons require authentication via .npmrc or similar config
// import { Notification03Icon } from '@hugeicons-pro/core-stroke-rounded'

@Component({
    selector: 'app-example',
    standalone: true,
    imports: [HugeiconsIconComponent],
    template: \` <hugeicons-icon [icon]="notification03Icon" /> \`,
})
export class ExampleComponent {
    notification03Icon = Notification03Icon
}`,
    props: jsProps({ classProp: 'class', multicolor: true })
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

<HugeiconsIcon icon={Notification03Icon} />`,
    props: jsProps({ classProp: 'class' })
  },
  'solid-js': {
    platform: 'solid-js',
    installation: {
      core: 'npm install @hugeicons/solid-js',
      packages: CORE_PACKAGES
    },
    basicUsage: `import { HugeiconsIcon } from '@hugeicons/solid-js'
// Using free icons (available by default)
import { Notification03Icon } from '@hugeicons/core-free-icons'
// Pro icons require authentication via .npmrc or similar config
// import { Notification03Icon } from '@hugeicons-pro/core-stroke-rounded'

function App() {
  return <HugeiconsIcon icon={Notification03Icon} />
}`,
    props: jsProps({ classProp: 'class', multicolor: true })
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
  return <HugeiconsIcon icon={Notification03Icon} />
}`,
    props: jsProps({ classProp: 'className', colorDefault: '#000' })
  },
  'flutter': {
    platform: 'flutter',
    installation: {
      // pub.dev package (free stroke-rounded icons); adds hugeicons: ^1.2.0 to pubspec.yaml
      core: 'flutter pub add hugeicons',
      packages: []
    },
    basicUsage: `import 'package:hugeicons/hugeicons.dart';

// Color and size follow the surrounding IconTheme by default
HugeIcon(
  icon: HugeIcons.strokeRoundedHome01,
),

// Or set them explicitly
HugeIcon(
  icon: HugeIcons.strokeRoundedHome01,
  color: Colors.red,
  size: 30.0,
  strokeWidth: 2.0,
),`,
    props: [
      { name: 'icon', type: 'List<List<dynamic>>', default: 'Required', description: 'The icon constant, e.g. HugeIcons.strokeRoundedHome01 (the free package includes stroke-rounded icons)' },
      { name: 'color', type: 'Color?', default: 'Theme color', description: 'Icon color. When omitted it uses IconTheme color, then the text color, then colorScheme.onSurface, so it follows light and dark themes' },
      { name: 'size', type: 'double?', default: '24.0', description: 'Icon size in logical pixels. Pass null to use the IconTheme size' },
      { name: 'strokeWidth', type: 'double?', default: 'Icon default', description: 'Overrides the stroke width of stroke icons. No effect on solid icons' },
      { name: 'secondaryColor', type: 'Color?', default: 'color', description: 'Color of the secondary layer of Duotone, Twotone and Bulk icons' },
      { name: 'disableSecondaryOpacity', type: 'bool', default: 'false', description: 'Draws the secondary layer at full opacity instead of its reduced opacity' }
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
export const PLATFORMS = Object.keys(PLATFORM_USAGE) as Platform[];

/**
 * Display names for the platform guides
 */
export const PLATFORM_LABELS: Record<Platform, string> = {
  'react': 'React',
  'vue': 'Vue',
  'angular': 'Angular',
  'svelte': 'Svelte',
  'solid-js': 'SolidJS',
  'react-native': 'React Native',
  'flutter': 'Flutter',
  'html': 'HTML (web font)',
};
