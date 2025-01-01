import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNumber,
  IsString,
} from 'class-validator';

export class BorrowingReportResponseDTO {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  bookName: string;

  @IsDateString()
  borrowDate: string;

  @IsDateString()
  dueDate: string;

  @IsBoolean()
  overdue: boolean;
}
