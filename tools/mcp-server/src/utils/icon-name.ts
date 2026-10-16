import type { IconStyle } from '../types.js';

const STYLE_PREFIX = /^(stroke|solid|bulk|duotone|twotone)(Rounded|Sharp|Standard)(?=[A-Z0-9])/;

/**
 * Normalize an icon name to the kebab-case form the API expects.
 *
 * Accepts what an assistant is likely to pass: "home-01", "Home-01", "home 01",
 * "home_01", and component or constant names such as "Home01Icon" or "strokeRoundedHome01".
 */
export function normalizeIconName(input: string): string {
    let name = input.trim();

    // Code identifiers (no separators): strip the framework prefix/suffix and split camelCase
    if (/^[A-Za-z][A-Za-z0-9]*$/.test(name) && /[A-Z]/.test(name)) {
        name = name
            .replace(STYLE_PREFIX, '')
            .replace(/Icon$/, '')
            .replace(/([a-z])([A-Z0-9])/g, '$1-$2')
            .replace(/([0-9])([A-Z])/g, '$1-$2');
    }

    return name.toLowerCase().replace(/[\s_]+/g, '-').replace(/-+/g, '-');
}

/**
 * Letters and digits only, lowercased, without a framework prefix or suffix.
 * "Home01Icon", "Home01FreeIcons", "strokeRoundedHome01" and "home-01" all become "home01".
 */
export function compactIconKey(input: string): string {
    return input
        .trim()
        .replace(/^HugeIcons\./, '')
        .replace(STYLE_PREFIX, '')
        .replace(/(FreeIcons|Icon)$/, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
}

// The naming rules below are ported from hugeicons-web (packages/lib/src/utils.ts and
// the icon preview's code-snippets.ts), which the package generators mirror. Keep them in sync.

const NUMBER_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS_WORDS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

const ORDINAL_MAP: Record<string, string> = {
    '1st': 'First',
    '2nd': 'Second',
    '3rd': 'Third',
    '3-d': 'ThreeD',
    '3d': 'ThreeD',
    '4-k': 'FourK',
    '4k': 'FourK',
    '7z': 'SevenZ',
};

function numberToWords(n: number): string {
    if (n < 20) return NUMBER_WORDS[n];
    if (n < 100) return TENS_WORDS[Math.floor(n / 10)] + (n % 10 ? NUMBER_WORDS[n % 10] : '');
    return String(n);
}

function toPascalCase(str: string): string {
    return str
        .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '$')
        .replace(/[^A-Za-z0-9]+/g, '$')
        .replace(/([a-z])([A-Z])/g, (_m, a, b) => `${a}$${b}`)
        .toLowerCase()
        .replace(/(\$)(\w?)/g, (_m, _a, b: string) => b.toUpperCase());
}

function toKebabCase(str: string): string {
    return str
        .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '')
        .replace(/([a-z])([A-Z])/g, (_m, a, b: string) => `${a}_${b.toLowerCase()}`)
        .replace(/[^A-Za-z0-9]+|_+/g, '-')
        .toLowerCase();
}

/**
 * Spell out ordinals and the short number tokens identifiers can't start with
 * ("1st-bracket" -> "First-bracket", "3d-move" -> "ThreeD-move"). With `everyDigit`,
 * a single digit before a dash is spelled out anywhere, as in the web font
 * ("sorting-1-9" -> "sorting-One-9"); otherwise only at the start.
 */
function ordinalToWord(name: string, everyDigit = false): string {
    return name
        .replace(/c\+\+|c\+plus/gi, 'Cpp')
        .replace(/\b(1st|2nd|3rd|3-d|3d|4-k|4k|7z)\b/gi, (match) => ORDINAL_MAP[match.toLowerCase()] ?? match)
        .replace(everyDigit ? /(^|-)(\d)-/g : /^()(\d)-/, (_m, lead, digit) => `${lead}${NUMBER_WORDS[Number(digit)]}-`);
}

/**
 * The export name in the JavaScript packages ("home-01" -> "Home01Icon",
 * "2nd-bracket" -> "SecondBracketIcon", "sorting-1-9" -> "SortingOneNineIcon")
 */
export function componentName(name: string): string {
    const normalized = ordinalToWord(name)
        .replace(/'/g, '')
        // runs of single digits are spelled out so `arrow-down-0-1` doesn't collide with `arrow-down-01`
        .replace(/(^|-)(\d(?:-\d)+)(?=-|$)/g, (_m, lead, run: string) =>
            lead + run.split('-').map((d) => NUMBER_WORDS[Number(d)]).join('-'))
        // an identifier can't start with a digit: `24-hours-clock` -> `TwentyFourHoursClockIcon`
        .replace(/^(\d+)(?=-|$)/, (m) => numberToWords(Number(m)));
    return toPascalCase(normalized) + 'Icon';
}

const FLUTTER_OVERRIDES: Record<string, string> = {
    '4-k': 'FourK',
    '4k': '4K',
    'c++': 'Cpp',
    'c+plus': 'Cpp',
};

function toFlutterPascalCase(value: string): string {
    return value
        .trim()
        .replace(/c\+\+|c\+plus|4-k|4k/gi, (match) => FLUTTER_OVERRIDES[match.toLowerCase()] ?? match)
        .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '')
        .split(/[^A-Za-z0-9]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
}

/**
 * The constant name in the Flutter packages ("home-01" -> "strokeRoundedHome01").
 * Digits are kept ("2nd-bracket" -> "strokeRounded2ndBracket").
 */
export function flutterName(name: string, style: IconStyle): string {
    const [type, variant] = style.split('-');
    return type + toFlutterPascalCase(variant) + toFlutterPascalCase(name);
}

/**
 * The icon's name in the web font, which the glyph API also uses
 * ("home-01" -> "home-01", "3d-move" -> "three-d-move", "sorting-1-9" -> "sorting-one-9")
 */
export function webfontName(name: string): string {
    return toKebabCase(ordinalToWord(name, true).replace(/'/g, ''));
}

/**
 * The web font class for the icon ("home-01" -> "hgi-home-01", "3d-move" -> "hgi-three-d-move")
 */
export function webfontClass(name: string): string {
    return `hgi-${webfontName(name)}`;
}

/**
 * The web font classes for a style: "hgi-stroke" for stroke-rounded, "hgi-solid hgi-sharp" for solid-sharp
 */
export function webfontStyleClasses(style: IconStyle): string {
    const [type, variant] = style.split('-');
    return variant === 'rounded' ? `hgi-${type}` : `hgi-${type} hgi-${variant}`;
}
