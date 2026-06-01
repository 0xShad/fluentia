import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "10 m"),
});

export async function rateLimit(key: string): Promise<boolean> {
  const { success } = await ratelimit.limit(key);
  return success;
}
