import axios from 'axios';
import { AllGlyphsResponse, SingleGlyphResponse, IconStyle, Glyph } from '../types.js';

const HUGEICONS_API_BASE = 'https://api.hugeicons.com/v1';

/**
 * Get all glyphs for a specific icon
 */
export async function getAllGlyphs(iconName: string): Promise<Glyph[]> {
    if (!iconName || !iconName.trim()) {
        throw new Error('Icon name is required');
    }

    try {
        const response = await axios.get<AllGlyphsResponse>(
            `${HUGEICONS_API_BASE}/icon/${iconName.trim()}/glyphs`,
            {
                headers: {
                    'accept': 'application/json'
                },
                timeout: 10000, // 10 second timeout
            }
        );

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch glyphs');
        }

        return response.data.data.glyphs;
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new Error(`Icon '${iconName}' not found`);
        }
        if (error.message) {
            throw new Error(`Failed to fetch glyphs: ${error.message}`);
        }
        throw new Error('Failed to fetch glyphs');
    }
}

/**
 * Get a specific glyph for an icon with a particular style
 */
export async function getGlyphByStyle(iconName: string, style: IconStyle): Promise<{ primary: Glyph; secondary: Glyph | null }> {
    if (!iconName || !iconName.trim()) {
        throw new Error('Icon name is required');
    }

    if (!style || !style.trim()) {
        throw new Error('Style is required');
    }

    try {
        const response = await axios.get<SingleGlyphResponse>(
            `${HUGEICONS_API_BASE}/icon/${iconName.trim()}/glyph`,
            {
                params: { style: style.trim() },
                headers: {
                    'accept': 'application/json'
                },
                timeout: 10000, // 10 second timeout
            }
        );

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch glyph');
        }

        return response.data.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new Error(`Icon '${iconName}' with style '${style}' not found`);
        }
        if (error.message) {
            throw new Error(`Failed to fetch glyph: ${error.message}`);
        }
        throw new Error('Failed to fetch glyph');
    }
}

