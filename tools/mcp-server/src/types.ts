/**
 * Interface for icon information from the API
 */
export interface IconInfo {
    name: string;
    /** The index API sends a comma-separated string, the search API an array */
    tags: string | string[];
    category: string;
    featured: boolean;
    version: string;
}

/**
 * Interface for search highlights from the API
 */
export interface SearchHighlights {
    name?: string[];
    tags?: string[];
}

/**
 * Interface for search result from the API
 */
export interface SearchResult {
    id: string;
    score: number;
    name: string;
    tags: string[] | string;
    category: string;
    featured: boolean;
    version: string;
    highlights: SearchHighlights;
}

/**
 * Interface for the complete search API response
 */
export interface SearchApiResponse {
    query: string;
    fuzzy_enabled: boolean;
    total: number;
    results: SearchResult[];
}

/**
 * Every icon style, in the order tools list them. Only stroke-rounded is free.
 */
export const ICON_STYLES = [
    'bulk-rounded',
    'duotone-rounded',
    'duotone-standard',
    'solid-rounded',
    'solid-sharp',
    'solid-standard',
    'stroke-rounded',
    'stroke-sharp',
    'stroke-standard',
    'twotone-rounded',
] as const;

export type IconStyle = typeof ICON_STYLES[number];

export const FREE_STYLE: IconStyle = 'stroke-rounded';

/**
 * Interface for a single glyph
 */
export interface Glyph {
    icon_name: string;
    style: IconStyle;
    unicode: string;
    unicode_decimal: number;
    id: string;
    created_at: string;
    updated_at: string;
}

/**
 * Interface for all glyphs response
 */
export interface AllGlyphsResponse {
    success: boolean;
    message: string | null;
    data: {
        glyphs: Glyph[];
    };
}

/**
 * Interface for single glyph response
 */
export interface SingleGlyphResponse {
    success: boolean;
    message: string | null;
    data: {
        primary: Glyph;
        secondary: Glyph | null;
    };
}
