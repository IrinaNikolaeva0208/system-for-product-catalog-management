import { InputType, Field, Float } from '@nestjs/graphql/dist';
import { IsString, IsNotEmpty } from 'class-validator';

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
  @IsString()
  price: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  category: string;
}
