import {
  IsInt,
  IsString,
  IsEmail,
  IsISO8601,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class BorrowingRecordByBookDTO {
  @IsInt()
  @IsNotEmpty()
  borrowing_id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsISO8601()
  borrowed_date: string;

  @IsISO8601()
  due_date: string;

  @IsISO8601()
  @IsOptional()
  returnDate?: string | null;
}
