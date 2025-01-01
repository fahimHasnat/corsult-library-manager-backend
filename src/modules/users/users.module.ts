import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { databaseProviders } from 'src/database/database.providers';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ...databaseProviders],
})
export class UsersModule {}
