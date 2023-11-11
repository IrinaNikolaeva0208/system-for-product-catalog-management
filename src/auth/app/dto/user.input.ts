import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class UserInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  login: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  password: string;
}
