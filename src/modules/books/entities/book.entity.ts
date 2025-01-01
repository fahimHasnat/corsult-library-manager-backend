import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { Category } from './category.entity';

@Table({
  tableName: 'books',
  schema: 'corsult',
  timestamps: false,
})
export class Book extends Model<Book> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  author: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  isbn: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  category: number;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  availability: boolean;

  @BelongsTo(() => Category)
  categoryDetails: Category;
}
