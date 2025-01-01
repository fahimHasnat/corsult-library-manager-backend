import { Global, Module } from '@nestjs/common';
import { MyRedisService } from './redis.service';

@Global()
@Module({
  providers: [MyRedisService],
  exports: [MyRedisService],
})
export class MyRedisModule {}
