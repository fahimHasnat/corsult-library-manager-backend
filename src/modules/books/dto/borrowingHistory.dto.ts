import {
  IsDateString,
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
} from 'class-validator';

export class BorrowingHistoryResponseDto {
  @IsInt()
  @IsNotEmpty({ message: 'Borrowing ID is required.' })
  readonly borrowing_id: number;

  @IsString()
  @IsNotEmpty({ message: 'Book name is required.' })
  readonly book_name: string;

  @IsString()
  @IsNotEmpty({ message: 'Author name is required.' })
  readonly author_name: string;

  @IsDateString(
    {},
    { message: 'Borrowed date must be a valid ISO date string (YYYY-MM-DD).' },
  )
  @IsNotEmpty({ message: 'Borrowed date is required.' })
  readonly borrowed_date: string;

  @IsDateString(
    {},
    { message: 'Due date must be a valid ISO date string (YYYY-MM-DD).' },
  )
  @IsNotEmpty({ message: 'Due date is required.' })
  readonly due_date: string;

  @IsDateString(
    {},
    { message: 'Return date must be a valid ISO date string (YYYY-MM-DD).' },
  )
  @IsOptional()
  readonly return_date: string;
}
