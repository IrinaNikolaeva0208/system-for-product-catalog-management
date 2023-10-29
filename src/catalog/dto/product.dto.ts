import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsString()
  category: string;
}
