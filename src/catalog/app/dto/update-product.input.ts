import { InputType, Field, Float } from '@nestjs/graphql/dist';
import { IsString, IsOptional } from 'class-validator';

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsString()
  price?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  category?: string;
}
