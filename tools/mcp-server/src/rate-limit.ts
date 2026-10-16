import type { IncomingMessage } from "node:http";

const WINDOW_MS = 60_000;

/**
 * Fixed-window, in-memory rate limiter keyed by client IP.
 *
 * Counts live in this process only, which is fine for a single container.
 * Running several replicas multiplies the effective limit by the replica count.
 */
export class RateLimiter {
  private windows = new Map<string, { count: number; resetAt: number }>();

  constructor(private readonly limitPerMinute: number) {
    // Drop expired windows so the map doesn't grow with every IP ever seen
    setInterval(() => {
      const now = Date.now();
      for (const [key, window] of this.windows) {
        if (window.resetAt <= now) this.windows.delete(key);
      }
    }, WINDOW_MS).unref();
  }

  /**
   * Record a request and return whether it is allowed, with the seconds until the window resets
   */
  hit(key: string): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
    const now = Date.now();
    let window = this.windows.get(key);
    if (!window || window.resetAt <= now) {
      window = { count: 0, resetAt: now + WINDOW_MS };
      this.windows.set(key, window);
    }

    window.count++;
    return {
      allowed: window.count <= this.limitPerMinute,
      remaining: Math.max(0, this.limitPerMinute - window.count),
      retryAfterSeconds: Math.ceil((window.resetAt - now) / 1000),
    };
  }
}

/**
 * Resolve the client IP from a proxy header, falling back to the socket address.
 *
 * Behind Traefik use `x-forwarded-for`: Traefik replaces the header for untrusted
 * sources, so its last entry is the address Traefik saw. Behind Cloudflare use
 * `cf-connecting-ip`, otherwise every client shares a Cloudflare edge IP.
 * Only use a header the proxy in front of this server always sets, since clients
 * can send any header themselves.
 */
export function getClientIp(req: IncomingMessage, header: string | undefined): string {
  const value = header ? req.headers[header.toLowerCase()] : undefined;
  const raw = Array.isArray(value) ? value[value.length - 1] : value;
  const ip = raw?.split(",").pop()?.trim();
  return ip || req.socket.remoteAddress || "unknown";
}
