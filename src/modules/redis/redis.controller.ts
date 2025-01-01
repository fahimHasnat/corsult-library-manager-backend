import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { MyRedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly myRedisService: MyRedisService) {}

  @Post('set')
  async set(
    @Body('key') key: string,
    @Body('value') value: string,
  ): Promise<void> {
    await this.myRedisService.set(key, value);
  }

  @Get('get/:key')
  async get(@Param('key') key: string): Promise<string> {
    return await this.myRedisService.get(key);
  }

  @Delete('delete/:key')
  async del(@Param('key') key: string): Promise<number> {
    return await this.myRedisService.del(key);
  }
}
