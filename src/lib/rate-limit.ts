import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "10 m"),
});

export async function rateLimit(key: string): Promise<boolean> {
  const { success } = await ratelimit.limit(key);
  return success;
}
