import { IsEmail, IsNumber, IsString } from 'class-validator';

export class UserReportResponseDTO {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  borrow_count: number;

  @IsNumber()
  overdue_count: number;
}
