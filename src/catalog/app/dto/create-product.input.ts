import { InputType, Field, Float } from '@nestjs/graphql/dist';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  category: string;
}
