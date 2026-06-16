import { Redis } from "@upstash/redis";

const redis = (() => {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
})();

export const CACHE_KEYS = {
  PRODUCTS_LIST:  "v1:products:published",
  PRODUCT:       (slug: string) => `v1:product:${slug}`,
  BLOG_LIST:      "v1:blog:published",
  BLOG_POST:     (slug: string) => `v1:blog:${slug}`,
  CERTS_ACTIVE:   "v1:certs:active",
  ADMIN_STATS:    "v1:admin:stats",
} as const;

export const TTL = {
  LIST:   300,   // 5 min — product / blog / cert lists
  DETAIL: 600,   // 10 min — single product / post
  STATS:   60,   // 1 min — admin dashboard counts
} as const;

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    return await redis.get<T>(key);
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  if (!redis) return;
  try {
    await redis.set(key, value, { ex: ttlSeconds });
  } catch { /* best-effort */ }
}

export async function cacheDel(...keys: string[]): Promise<void> {
  if (!redis || keys.length === 0) return;
  try {
    await redis.del(...keys);
  } catch { /* best-effort */ }
}
