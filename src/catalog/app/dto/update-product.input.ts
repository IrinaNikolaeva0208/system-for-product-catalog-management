import { IsString, IsOptional } from 'class-validator';

export class UpdateProductInput {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  price?: number;

  @IsOptional()
  @IsString()
  category?: string;
}
