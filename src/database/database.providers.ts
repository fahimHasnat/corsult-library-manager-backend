import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from './constants';
import { databaseConfig } from './database.config';
import { Book } from '../modules/books/entities/book.entity';
import { Category } from 'src/modules/books/entities/category.entity';
import { User } from '../modules/users/entities/user.entity';
import { UserRoleMap } from 'src/modules/users/entities/user-role-map.entity';
import { Role } from 'src/modules/users/entities/role.entity';
import { Borrowing } from 'src/modules/books/entities/borrowing.entity';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize(config);
      sequelize.addModels([Book, Category, User, Role, UserRoleMap, Borrowing]);
      await sequelize.sync();
      console.log('Database Connected Successfully');
      return sequelize;
    },
  },
];
