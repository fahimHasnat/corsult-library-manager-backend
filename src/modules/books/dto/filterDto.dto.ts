import {
  IsArray,
  IsObject,
  IsString,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class Category {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}

class CategoriesMap {
  [key: string]: number;
}

export class FilterResponseDTO {
  @IsArray()
  @IsString({ each: true })
  authors: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Category)
  categories: Category[];

  @IsObject()
  categories_map: CategoriesMap;
}
