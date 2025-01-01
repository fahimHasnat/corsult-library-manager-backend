import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { UserRoleMap } from '../entities/user-role-map.entity';

@Table({
  tableName: 'roles',
  schema: 'corsult',
  timestamps: false,
})
export class Role extends Model<Role> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @HasMany(() => UserRoleMap)
  userRoleMaps: UserRoleMap[];
}
