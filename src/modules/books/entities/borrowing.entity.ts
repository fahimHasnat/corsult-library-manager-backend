import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
import { Book } from './book.entity';

@Table({
  tableName: 'borrowings',
  schema: 'corsult',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Borrowing extends Model<Borrowing> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @ForeignKey(() => Book)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  book_id: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  borrowed_date: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  due_date: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  return_date: Date;

  @CreatedAt
  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
  })
  created_at: Date;

  @UpdatedAt
  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
  })
  updated_at: Date;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Book)
  book: Book;
}
