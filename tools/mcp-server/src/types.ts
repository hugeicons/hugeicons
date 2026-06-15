/**
 * Interface for icon information from the API
 */
export interface IconInfo {
    id: string;
    name: string;
    tags: string[];
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
    tags: string[];
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
 * Icon style types
 */
export type IconStyle = 
    | 'bulk-rounded'
    | 'duotone-rounded'
    | 'duotone-standard'
    | 'solid-rounded'
    | 'solid-sharp'
    | 'solid-standard'
    | 'stroke-rounded'
    | 'stroke-sharp'
    | 'stroke-standard'
    | 'twotone-rounded';

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