import { ObjectType, Field } from '@nestjs/graphql/dist';

@ObjectType()
export class ResponseMessage {
  @Field()
  message: string;
}
