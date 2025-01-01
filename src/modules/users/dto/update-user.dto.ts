import { IsString, IsOptional, IsNotEmpty, Validate } from 'class-validator';

class AtLeastOneFieldValidator {
  validate(object: any) {
    return object.name !== undefined || object.phone_number !== undefined;
  }
  defaultMessage() {
    return 'At least one of "name" or "phone_number" must be provided.';
  }
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone_number?: string;

  @Validate(AtLeastOneFieldValidator)
  static validate(dto: UpdateUserDto) {
    return new AtLeastOneFieldValidator().validate(dto);
  }
}
