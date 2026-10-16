import { AllGlyphsResponse, SingleGlyphResponse, IconStyle, Glyph } from '../types.js';
import { TtlCache } from './cache.js';
import { fetchJson, HttpError } from './fetch-json.js';

const HUGEICONS_API_BASE = 'https://api.hugeicons.com/v1';

// Glyph codepoints rarely change, so lookups are cached for a day
const GLYPH_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const GLYPH_CACHE_MAX_ENTRIES = 5000;

/**
 * The fields of a glyph an assistant needs (drops database ids and timestamps)
 */
export type GlyphInfo = Pick<Glyph, 'icon_name' | 'style' | 'unicode' | 'unicode_decimal'>;

/**
 * Thrown when the icon (or icon + style) doesn't exist, as opposed to the API failing
 */
export class IconNotFoundError extends Error {}

function toGlyphInfo({ icon_name, style, unicode, unicode_decimal }: Glyph): GlyphInfo {
    return { icon_name, style, unicode, unicode_decimal };
}

async function fetchGlyphs<T extends { success: boolean; message: string | null }>(
    path: string,
    params: Record<string, string>,
    notFoundMessage: string,
): Promise<T> {
    let data: T;
    try {
        data = await fetchJson<T>(`${HUGEICONS_API_BASE}${path}`, { params, timeoutMs: 10000 });
    } catch (error) {
        if (error instanceof HttpError && error.status === 404) throw new IconNotFoundError(notFoundMessage);
        throw new Error(`The Hugeicons glyph service is unavailable: ${error instanceof Error ? error.message : 'unknown error'}`);
    }

    // The API answers unknown icons with 200 and success: false
    if (!data.success) throw new IconNotFoundError(notFoundMessage);
    return data;
}

/**
 * Get all glyphs for a specific icon
 */
const allGlyphsCache = new TtlCache<GlyphInfo[]>(GLYPH_CACHE_TTL_MS, GLYPH_CACHE_MAX_ENTRIES);

export function getAllGlyphs(iconName: string): Promise<GlyphInfo[]> {
    return allGlyphsCache.getOrLoad(iconName, async () => {
        const data = await fetchGlyphs<AllGlyphsResponse>(
            `/icon/${encodeURIComponent(iconName)}/glyphs`,
            {},
            `Icon '${iconName}' not found`,
        );
        return data.data.glyphs.map(toGlyphInfo);
    });
}

/**
 * Get a specific glyph for an icon with a particular style
 */
type StyleGlyph = { primary: GlyphInfo; secondary: GlyphInfo | null };

const styleGlyphCache = new TtlCache<StyleGlyph>(GLYPH_CACHE_TTL_MS, GLYPH_CACHE_MAX_ENTRIES);

export function getGlyphByStyle(iconName: string, style: IconStyle): Promise<StyleGlyph> {
    return styleGlyphCache.getOrLoad(`${iconName}:${style}`, async () => {
        const data = await fetchGlyphs<SingleGlyphResponse>(
            `/icon/${encodeURIComponent(iconName)}/glyph`,
            { style },
            `Icon '${iconName}' with style '${style}' not found`,
        );
        return {
            primary: toGlyphInfo(data.data.primary),
            secondary: data.data.secondary ? toGlyphInfo(data.data.secondary) : null,
        };
    });
}
