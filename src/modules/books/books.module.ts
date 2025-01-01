import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { databaseProviders } from 'src/database/database.providers';
import { MyRedisModule } from '../redis/redis.module';

@Module({
  imports: [MyRedisModule],
  providers: [BooksService, ...databaseProviders],
  controllers: [BooksController],
})
export class BooksModule {}
