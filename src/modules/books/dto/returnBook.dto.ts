import { IsInt, IsNotEmpty } from 'class-validator';

export class ReturnBookDto {
  @IsInt()
  @IsNotEmpty({ message: 'Book ID is required.' })
  readonly book_id: number;

  @IsInt()
  @IsNotEmpty({ message: 'Borrowing ID is required.' })
  readonly borrowing_id: number;
}
