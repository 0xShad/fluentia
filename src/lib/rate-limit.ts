const store = new Map<string, number[]>();

/**
 * Sliding-window in-memory rate limiter.
 * Returns true if the request is allowed, false if it exceeds the limit.
 * Works within a single serverless instance — sufficient for per-user quota protection.
 */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const hits = (store.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) return false;
  store.set(key, [...hits, now]);
  return true;
}
