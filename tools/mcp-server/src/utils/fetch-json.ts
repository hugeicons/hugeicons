/**
 * Thrown for a non-2xx response, so callers can tell a 404 apart from an outage
 */
export class HttpError extends Error {
    constructor(readonly status: number, url: string) {
        super(`Request to ${url} failed with status ${status}`);
    }
}

/**
 * GET a JSON document with a timeout
 */
export async function fetchJson<T>(
    url: string,
    { params, timeoutMs }: { params?: Record<string, string>; timeoutMs: number },
): Promise<T> {
    const target = new URL(url);
    for (const [key, value] of Object.entries(params ?? {})) target.searchParams.set(key, value);

    const response = await fetch(target, {
        headers: { accept: 'application/json' },
        signal: AbortSignal.timeout(timeoutMs),
    });
    if (!response.ok) throw new HttpError(response.status, target.origin + target.pathname);
    return (await response.json()) as T;
}
