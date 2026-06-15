import axios from 'axios';
import { IconInfo, SearchApiResponse } from '../types.js';

/**
 * Search for icons using the Hugeicons API
 */
export async function searchIcons(searchQuery: string): Promise<IconInfo[]> {
    if (!searchQuery || !searchQuery.trim()) {
        return [];
    }

    try {
        const response = await axios.get<SearchApiResponse>(
            `https://search.hugeicons.com/search`,
            {
                params: { q: searchQuery.trim() },
                timeout: 10000, // 10 second timeout
            }
        );

        // Convert API results to our IconInfo format
        return response.data.results.map(result => ({
            id: result.id,
            name: result.name,
            tags: result.tags, // Keep as array to match IconInfo interface
            category: result.category,
            featured: result.featured,
            version: result.version,
        }));
    } catch (error) {
        console.error('Failed to search icons:', error);
        
        // If API fails, return empty results rather than throwing
        // This ensures the MCP server doesn't crash if the search API is down
        return [];
    }
} 