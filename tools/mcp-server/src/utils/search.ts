import { SearchApiResponse, SearchResult } from '../types.js';
import { TtlCache } from './cache.js';
import { fetchJson } from './fetch-json.js';
import { componentName } from './icon-name.js';

export const DEFAULT_SEARCH_LIMIT = 20;
export const MAX_SEARCH_LIMIT = 50;
export const MAX_SEARCH_TERMS = 10;

// Raw API results per term, so different limits share one entry
const searchCache = new TtlCache<SearchResult[]>(60 * 60 * 1000, 2000);

export interface IconMatch {
    name: string;
    /** Export name in the JavaScript packages, e.g. Home01Icon */
    component: string;
    category: string;
    tags: string[];
}

export interface TermResults {
    query: string;
    /** Relevant matches found, before the limit is applied */
    total: number;
    /** True when nothing matched closely, so these are the search API's best fuzzy guesses */
    fuzzy: boolean;
    results: IconMatch[];
}

/**
 * Thrown when the search API can't be reached, so callers can tell
 * "nothing matched" apart from "search is down"
 */
export class SearchUnavailableError extends Error {}

/**
 * Lowercased words in a name or tag ("shopping-cart-01" -> ["shopping", "cart", "01"])
 */
export function words(text: string): string[] {
    return text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

/**
 * Singular and plural forms, so "carts" finds "cart" and "card" doesn't match "cards" by accident
 */
function forms(word: string): string[] {
    if (word.endsWith('ies') && word.length > 4) return [word, `${word.slice(0, -3)}y`];
    if (word.endsWith('es') && word.length > 4) return [word, word.slice(0, -2), word.slice(0, -1)];
    if (word.endsWith('s') && word.length > 3) return [word, word.slice(0, -1)];
    return [word, `${word}s`];
}

/**
 * Scores how closely an icon matches the query. 0 means it only matched loosely
 * (a typo-tolerant hit such as "chart" for "cart") and should be dropped.
 */
export function relevance(queryWords: string[], name: string, tags: string[]): number {
    const nameWords = words(name);
    const tagWords = new Set(tags.flatMap(words));
    const phrase = queryWords.join(' ');
    const has = (pool: Iterable<string>, word: string) => {
        const set = pool instanceof Set ? pool : new Set(pool);
        return forms(word).some((f) => set.has(f));
    };

    // "home-01" or "home" for "home"; "shopping-cart-01" for "shopping cart"
    const baseName = nameWords.filter((w) => !/^\d+$/.test(w)).join(' ');
    if (baseName === phrase) return 100;
    if (queryWords.every((w) => has(nameWords, w))) {
        // Prefer names that start with the query, then icons tagged with it, then shorter (more general) names
        const startsWithQuery = nameWords.slice(0, queryWords.length).join(' ') === phrase;
        const tagged = tags.some((t) => queryWords.some((w) => forms(w).includes(t.toLowerCase().trim())));
        return (startsWithQuery ? 80 : 70) + (tagged ? 5 : 0) - baseName.split(" ").length;
    }
    if (tags.some((t) => t.toLowerCase().trim() === phrase)) return 60;
    if (queryWords.every((w) => has(nameWords, w) || has(tagWords, w))) return 40;
    return 0;
}

export function toTags(tags: string[] | string): string[] {
    if (Array.isArray(tags)) return tags;
    return tags.split(',').map((t) => t.trim()).filter(Boolean);
}

async function searchTerm(query: string, limit: number): Promise<TermResults> {
    const results = await searchCache.getOrLoad(query, async () => {
        try {
            const response = await fetchJson<SearchApiResponse>('https://search.hugeicons.com/search', {
                params: { q: query },
                timeoutMs: 10000,
            });
            return response.results;
        } catch (error) {
            console.error('Failed to search icons:', error);
            throw new SearchUnavailableError('The Hugeicons search service is unavailable. Try again shortly.');
        }
    });

    const queryWords = words(query);
    const scored = results
        .map((result, index) => {
            const tags = toTags(result.tags);
            return { result, tags, index, score: relevance(queryWords, result.name, tags) };
        })
        .filter((r) => r.score > 0)
        // Numbered variants of an exact match read best in order (home-01, home-02, ...);
        // otherwise keep the API's order within the same score
        .sort((a, b) => b.score - a.score
            || (a.score === 100 ? a.result.name.localeCompare(b.result.name, undefined, { numeric: true }) : 0)
            || a.index - b.index);

    // Nothing matched closely (e.g. a typo): fall back to the API's fuzzy top results
    const fuzzy = scored.length === 0;
    const matches = fuzzy
        ? results.map((result) => ({ result, tags: toTags(result.tags) }))
        : scored;

    return {
        query,
        total: matches.length,
        fuzzy,
        results: matches.slice(0, limit).map(({ result, tags }) => ({
            name: result.name,
            component: componentName(result.name),
            category: result.category,
            tags,
        })),
    };
}

/**
 * Search for icons using the Hugeicons API. Comma-separated queries are searched separately.
 */
export async function searchIcons(searchQuery: string, limit = DEFAULT_SEARCH_LIMIT): Promise<TermResults[]> {
    const terms = splitTerms(searchQuery).slice(0, MAX_SEARCH_TERMS);
    return Promise.all(terms.map((term) => searchTerm(term, limit)));
}

/**
 * The distinct terms in a comma-separated query. Callers check the count before searching:
 * batching is the cheap way to use this tool, so quietly dropping the overflow would lose
 * icons a migration thinks it has resolved.
 */
export function splitTerms(searchQuery: string): string[] {
    return [...new Set(
        searchQuery.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean)
    )];
}
