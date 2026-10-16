/**
 * The full icon index from hugeicons.com, shared by every server instance, so
 * the HTTP server (one instance per request) fetches it once and refreshes it periodically.
 */

import { IconInfo } from "./types.js";
import { fetchJson } from "./utils/fetch-json.js";
import { compactIconKey, componentName, normalizeIconName } from "./utils/icon-name.js";
import { relevance, toTags, words } from "./utils/search.js";

const ICONS_URL = "https://hugeicons.com/api/icons";
const ICONS_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const ICONS_FETCH_TIMEOUT_MS = 15_000;
// After a failed fetch, wait this long before trying the API again
const ICONS_RETRY_DELAY_MS = 30_000;
const MAX_SUGGESTIONS = 5;

/**
 * The icon list with the lookups derived from it, built once per fetch
 */
export class IconIndex {
  readonly names: Set<string>;
  /** Icon count per category, sorted by name */
  readonly categoryCounts: Record<string, number>;
  private byKey = new Map<string, string>();
  private resourceJson?: string;

  constructor(readonly icons: IconInfo[]) {
    this.names = new Set(icons.map((icon) => icon.name));

    const counts: Record<string, number> = {};
    for (const icon of icons) counts[icon.category] = (counts[icon.category] ?? 0) + 1;
    this.categoryCounts = Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));

    // Kebab names win over component names when two icons share a key
    for (const { name } of icons) this.addKey(compactIconKey(name), name);
    for (const { name } of icons) this.addKey(compactIconKey(componentName(name)), name);
  }

  private addKey(key: string, name: string) {
    if (key && !this.byKey.has(key)) this.byKey.set(key, name);
  }

  /**
   * Find the icon an assistant meant: "home-01", "Home 01", "Home01Icon",
   * "SecondBracketIcon", "strokeRounded2ndBracket", ...
   */
  resolve(input: string): string | undefined {
    const name = normalizeIconName(input);
    if (this.names.has(name)) return name;
    if (this.names.has(input.trim())) return input.trim();
    return this.byKey.get(compactIconKey(input));
  }

  /**
   * Icons whose name or tags match the words of an unknown name
   */
  suggest(input: string): string[] {
    const allWords = words(normalizeIconName(input));
    // A wrong variant number ("home-99") shouldn't rule out the other variants
    const nonNumeric = allWords.filter((word) => !/^\d+$/.test(word));
    const queryWords = nonNumeric.length > 0 ? nonNumeric : allWords;
    if (queryWords.length === 0) return [];
    return this.icons
      .map((icon) => ({ name: icon.name, score: relevance(queryWords, icon.name, toTags(icon.tags)) }))
      .filter((match) => match.score > 0)
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, undefined, { numeric: true }))
      .slice(0, MAX_SUGGESTIONS)
      .map((match) => match.name);
  }

  /**
   * The hugeicons://icons/index resource body
   */
  toResourceJson(): string {
    this.resourceJson ??= JSON.stringify(this.icons.map(({ name, category }) => ({ name, category })));
    return this.resourceJson;
  }
}

let current: { index: IconIndex; fetchedAt: number } | null = null;
let request: Promise<IconIndex> | null = null;
let failure: { error: unknown; at: number } | null = null;

function fetchIndex(): Promise<IconIndex> {
  // Concurrent callers share one in-flight request
  request ??= (async () => {
    try {
      const data = await fetchJson<{ icons: IconInfo[] }>(ICONS_URL, { timeoutMs: ICONS_FETCH_TIMEOUT_MS });
      current = { index: new IconIndex(data.icons), fetchedAt: Date.now() };
      failure = null;
      return current.index;
    } catch (error) {
      failure = { error, at: Date.now() };
      throw error;
    } finally {
      request = null;
    }
  })();

  return request;
}

/**
 * Get the icon index. A stale index is served while it refreshes in the
 * background, and is kept if the refresh fails.
 */
export async function loadIconIndex(): Promise<IconIndex> {
  const backingOff = failure !== null && Date.now() - failure.at < ICONS_RETRY_DELAY_MS;

  if (current) {
    const stale = Date.now() - current.fetchedAt >= ICONS_CACHE_TTL_MS;
    if (stale && !backingOff) {
      fetchIndex().catch((error) => console.error("Failed to refresh the icon index:", error));
    }
    return current.index;
  }

  if (backingOff) throw failure!.error;
  return fetchIndex();
}

/**
 * Fetch the icon index ahead of the first request (used by the HTTP server at startup)
 */
export function preloadIcons(): Promise<void> {
  return loadIconIndex().then(
    () => undefined,
    (error) => console.error("Failed to preload the icon index:", error),
  );
}
