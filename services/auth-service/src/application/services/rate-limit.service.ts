export interface RateLimiter {
  consume(key: string): Promise<void>;
}

export class NoopRateLimiter implements RateLimiter {
  async consume(): Promise<void> {
    return;
  }
}
