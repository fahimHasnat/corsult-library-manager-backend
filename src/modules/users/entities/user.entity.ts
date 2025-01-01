import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { UserRoleMap } from './user-role-map.entity';

@Table({
  tableName: 'users',
  schema: 'corsult',
  timestamps: false,
})
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone_number: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @HasMany(() => UserRoleMap)
  userRoleMaps: UserRoleMap[];
}
