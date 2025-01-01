import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class BorrowingRecordResponseDto {
  @IsInt()
  @IsNotEmpty({ message: 'Borrowing ID is required.' })
  borrowing_id: number;

  @IsString()
  @IsNotEmpty({ message: 'User name is required.' })
  name: string;

  @IsEmail({}, { message: 'Email must be a valid email address.' })
  email: string;

  @IsDateString(
    {},
    { message: 'Borrowed date must be a valid ISO date string (YYYY-MM-DD).' },
  )
  borrowed_date: string;

  @IsDateString(
    {},
    { message: 'Due date must be a valid ISO date string (YYYY-MM-DD).' },
  )
  due_date: string;

  @IsDateString(
    {},
    { message: 'Return date must be a valid ISO date string (YYYY-MM-DD).' },
  )
  return_date: string | null;
}
