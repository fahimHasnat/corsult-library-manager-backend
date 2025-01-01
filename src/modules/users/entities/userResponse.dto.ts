import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UserResponseDTO {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  phone_number?: string | null;

  @IsString()
  role: string;
}
