import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { databaseProviders } from 'src/database/database.providers';
@Module({
  providers: [TasksService, ...databaseProviders],
})
export class TasksModule {}
