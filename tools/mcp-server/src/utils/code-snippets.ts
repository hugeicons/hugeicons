import { FREE_STYLE, IconStyle } from '../types.js';
import { componentName, flutterName, webfontClass, webfontStyleClasses } from './icon-name.js';
import { Platform } from './platform-usage.js';

export interface IconCode {
    icon: string;
    platform: Platform;
    style: IconStyle;
    /** True for stroke-rounded, which ships in the free packages */
    free: boolean;
    /** The identifier to reference in code: an export, a Flutter constant or web font classes */
    reference: string;
    install: string;
    usage: string;
    /** Setup needed before the install command works (Pro styles) */
    note?: string;
}

const NPM_PRO_NOTE =
    'Pro styles need a Hugeicons Pro license. Add the @hugeicons-pro registry and your token to .npmrc before installing.';

/**
 * Solid and bulk icons are filled, so strokeWidth does nothing
 */
function hasStroke(style: IconStyle): boolean {
    return !style.startsWith('solid') && !style.startsWith('bulk');
}

function iconPackage(style: IconStyle): string {
    return style === FREE_STYLE ? '@hugeicons/core-free-icons' : `@hugeicons-pro/core-${style}`;
}

/**
 * Ready-to-paste install command and usage for one icon on one platform
 */
export function getIconCode(icon: string, platform: Platform, style: IconStyle): IconCode {
    const free = style === FREE_STYLE;
    const component = componentName(icon);
    const pkg = iconPackage(style);
    const stroke = hasStroke(style);
    const base = { icon, platform, style, free };
    const npmNote = free ? {} : { note: NPM_PRO_NOTE };

    switch (platform) {
        case 'react':
        case 'solid-js':
        case 'react-native': {
            const color = platform === 'react-native' ? '#000000' : 'currentColor';
            const extra = platform === 'react-native' ? ' react-native-svg' : '';
            return {
                ...base,
                reference: component,
                install: `npm install @hugeicons/${platform} ${pkg}${extra}`,
                usage: [
                    `import { HugeiconsIcon } from '@hugeicons/${platform}'`,
                    `import { ${component} } from '${pkg}'`,
                    '',
                    `<HugeiconsIcon icon={${component}} size={24} color="${color}"${stroke ? ' strokeWidth={1.5}' : ''} />`,
                ].join('\n'),
                ...npmNote,
            };
        }
        case 'vue':
            return {
                ...base,
                reference: component,
                install: `npm install @hugeicons/vue ${pkg}`,
                usage: [
                    '<script setup>',
                    `import { HugeiconsIcon } from '@hugeicons/vue'`,
                    `import { ${component} } from '${pkg}'`,
                    '</script>',
                    '',
                    '<template>',
                    `  <HugeiconsIcon :icon="${component}" :size="24" color="currentColor"${stroke ? ' :stroke-width="1.5"' : ''} />`,
                    '</template>',
                ].join('\n'),
                ...npmNote,
            };
        case 'svelte':
            return {
                ...base,
                reference: component,
                install: `npm install @hugeicons/svelte ${pkg}`,
                usage: [
                    '<script>',
                    `  import { HugeiconsIcon } from '@hugeicons/svelte'`,
                    `  import { ${component} } from '${pkg}'`,
                    '</script>',
                    '',
                    `<HugeiconsIcon icon={${component}} size={24} color="currentColor"${stroke ? ' strokeWidth={1.5}' : ''} />`,
                ].join('\n'),
                ...npmNote,
            };
        case 'angular':
            return {
                ...base,
                reference: component,
                install: `npm install @hugeicons/angular ${pkg}`,
                usage: [
                    `import { Component } from '@angular/core'`,
                    `import { HugeiconsIconComponent } from '@hugeicons/angular'`,
                    `import { ${component} } from '${pkg}'`,
                    '',
                    '@Component({',
                    `  selector: 'app-example',`,
                    '  standalone: true,',
                    '  imports: [HugeiconsIconComponent],',
                    `  template: \`<hugeicons-icon [icon]="${component}" [size]="24" color="currentColor"${stroke ? ' [strokeWidth]="1.5"' : ''} />\`,`,
                    '})',
                    'export class ExampleComponent {',
                    `  ${component} = ${component}`,
                    '}',
                ].join('\n'),
                ...npmNote,
            };
        case 'flutter': {
            const reference = `HugeIcons.${flutterName(icon, style)}`;
            return {
                ...base,
                reference,
                install: free ? 'flutter pub add hugeicons' : 'Add the hugeicons Pro package from OnePub to pubspec.yaml',
                usage: [
                    `import 'package:hugeicons/${free ? 'hugeicons.dart' : 'hugeicons_full.dart'}';`,
                    '',
                    'HugeIcon(',
                    `  icon: ${reference},`,
                    '  size: 24.0,',
                    ...(stroke ? ['  strokeWidth: 1.5,'] : []),
                    ')',
                ].join('\n'),
                ...(free ? {} : {
                    note: 'Pro styles need a Hugeicons Pro license. The Pro Flutter package is hosted on OnePub; the token tab in your Hugeicons profile has the setup steps.',
                }),
            };
        }
        case 'html': {
            const classes = `hgi ${webfontStyleClasses(style)} ${webfontClass(icon)}`;
            const stylesheet = free ? 'https://use.hugeicons.com/font/icons.css' : 'https://sets.hugeicons.com/YOUR-SET-ID.css';
            return {
                ...base,
                reference: classes,
                install: `<link rel="stylesheet" href="${stylesheet}" />`,
                usage: `<i class="${classes}"></i>`,
                ...(free ? {} : {
                    note: 'Pro styles load from your own icon set. Create one on hugeicons.com and replace YOUR-SET-ID with its id.',
                }),
            };
        }
    }
}
