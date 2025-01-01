import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';

export class BorrowBookDto {
  @IsInt()
  @IsNotEmpty({ message: 'Book ID is required.' })
  readonly book_id: number;

  @IsDateString(
    {},
    { message: 'Due Date must be a valid ISO date string (YYYY-MM-DD).' },
  )
  @IsNotEmpty({ message: 'Due Date is required.' })
  readonly due_date: string;
}
