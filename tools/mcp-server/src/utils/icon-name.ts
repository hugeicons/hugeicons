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
            .replace(/^(stroke|solid|bulk|duotone|twotone)(Rounded|Sharp|Standard)(?=[A-Z0-9])/, '')
            .replace(/Icon$/, '')
            .replace(/([a-z])([A-Z0-9])/g, '$1-$2')
            .replace(/([0-9])([A-Z])/g, '$1-$2');
    }

    return name.toLowerCase().replace(/[\s_]+/g, '-').replace(/-+/g, '-');
}
