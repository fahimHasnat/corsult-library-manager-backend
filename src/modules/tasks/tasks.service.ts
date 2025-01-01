import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class TasksService {
  constructor(@Inject('SEQUELIZE') private sequelize: Sequelize) {}
  private readonly logger = new Logger(TasksService.name);
  @Cron('30 23 * * *')
  async handleNightlyJob() {
    await this.sequelize.query(`CALL process_overdue_borrowings();`);
    this.logger.debug('Running nightly job at 11:30 PM');
  }
}
