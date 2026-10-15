import axios from 'axios';
import { AllGlyphsResponse, SingleGlyphResponse, IconStyle, Glyph } from '../types.js';

const HUGEICONS_API_BASE = 'https://api.hugeicons.com/v1';

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
        const response = await axios.get<T>(`${HUGEICONS_API_BASE}${path}`, {
            params,
            headers: { accept: 'application/json' },
            timeout: 10000,
        });
        data = response.data;
    } catch (error: any) {
        if (error.response?.status === 404) throw new IconNotFoundError(notFoundMessage);
        throw new Error(`The Hugeicons glyph service is unavailable: ${error.message ?? 'unknown error'}`);
    }

    // The API answers unknown icons with 200 and success: false
    if (!data.success) throw new IconNotFoundError(notFoundMessage);
    return data;
}

/**
 * Get all glyphs for a specific icon
 */
export async function getAllGlyphs(iconName: string): Promise<GlyphInfo[]> {
    const data = await fetchGlyphs<AllGlyphsResponse>(
        `/icon/${encodeURIComponent(iconName)}/glyphs`,
        {},
        `Icon '${iconName}' not found`,
    );
    return data.data.glyphs.map(toGlyphInfo);
}

/**
 * Get a specific glyph for an icon with a particular style
 */
export async function getGlyphByStyle(
    iconName: string,
    style: IconStyle,
): Promise<{ primary: GlyphInfo; secondary: GlyphInfo | null }> {
    const data = await fetchGlyphs<SingleGlyphResponse>(
        `/icon/${encodeURIComponent(iconName)}/glyph`,
        { style },
        `Icon '${iconName}' with style '${style}' not found`,
    );
    return {
        primary: toGlyphInfo(data.data.primary),
        secondary: data.data.secondary ? toGlyphInfo(data.data.secondary) : null,
    };
}
