type Key = string;

// Very simple in-memory sliding window limiter. Suitable for single-instance dev.
// For multi-instance production, use a shared store (e.g., Redis/Upstash).
const hits = new Map<Key, number[]>();

export function rateLimit({ key, windowMs, max }: { key: string; windowMs: number; max: number }) {
  const now = Date.now();
  const windowStart = now - windowMs;

  const arr = hits.get(key) ?? [];
  // prune
  const recent = arr.filter((t) => t > windowStart);
  recent.push(now);
  hits.set(key, recent);

  return {
    ok: recent.length <= max,
    remaining: Math.max(0, max - recent.length),
    resetMs: recent[0] ? recent[0] + windowMs - now : windowMs,
  };
}
