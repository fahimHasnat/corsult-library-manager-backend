import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class UpdateBookDto {
  @IsOptional()
  @IsString({ message: 'Title must be a string!' })
  readonly title?: string;

  @IsOptional()
  @IsString({ message: 'Author must be a string!' })
  readonly author?: string;

  @IsOptional()
  @IsString({ message: 'ISBN must be a string!' })
  readonly isbn?: string;

  @IsOptional()
  @IsInt({ message: 'Category must be an integer!' })
  readonly category?: number;

  @IsOptional()
  @IsBoolean({ message: 'Availability must be a boolean value!' })
  readonly availability?: boolean;
}
