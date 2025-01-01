import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  MinLength,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required.' })
  @MinLength(1, { message: 'Title must not be empty.' })
  readonly title: string;

  @IsString()
  @IsNotEmpty({ message: 'Author is required.' })
  readonly author: string;

  @IsString()
  @IsOptional()
  readonly isbn?: string;

  @IsInt({ message: 'Category ID must be an integer.' })
  @IsNotEmpty({ message: 'Category ID is required.' })
  readonly category: number;
}
