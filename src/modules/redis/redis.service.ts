import { Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';

@Injectable()
export class MyRedisService {
  private readonly redis: Redis.Redis;

  constructor() {
    console.log('MyRedisService initialized');
    this.redis = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }

  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      await this.redis.set(key, value, 'EX', ttl);
    } else {
      await this.redis.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async del(key: string): Promise<number> {
    return this.redis.del(key);
  }

  async quit() {
    await this.redis.quit();
  }
}
