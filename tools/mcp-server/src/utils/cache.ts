/**
 * Small in-memory cache with a per-entry TTL and a size cap.
 *
 * Map keeps insertion order, so re-inserting on read makes the first key the
 * least recently used one, which is what gets evicted when the cache is full.
 */
export class TtlCache<V> {
    private entries = new Map<string, { value: V; expiresAt: number }>();
    private inFlight = new Map<string, Promise<V>>();

    constructor(private readonly ttlMs: number, private readonly maxEntries: number) {}

    get(key: string): V | undefined {
        const entry = this.entries.get(key);
        if (!entry) return undefined;
        this.entries.delete(key);
        if (entry.expiresAt <= Date.now()) return undefined;
        this.entries.set(key, entry);
        return entry.value;
    }

    set(key: string, value: V): void {
        this.entries.delete(key);
        this.entries.set(key, { value, expiresAt: Date.now() + this.ttlMs });
        if (this.entries.size > this.maxEntries) {
            this.entries.delete(this.entries.keys().next().value!);
        }
    }

    /**
     * Return the cached value or load it. Concurrent misses for the same key
     * share one request, and failures are not cached.
     */
    getOrLoad(key: string, load: () => Promise<V>): Promise<V> {
        const hit = this.get(key);
        if (hit !== undefined) return Promise.resolve(hit);

        let request = this.inFlight.get(key);
        if (!request) {
            request = load()
                .then((value) => {
                    this.set(key, value);
                    return value;
                })
                .finally(() => this.inFlight.delete(key));
            this.inFlight.set(key, request);
        }
        return request;
    }
}
