import { ObjectType, Field, ID } from '@nestjs/graphql/dist';

@ObjectType()
export class DeletedId {
  @Field(() => ID)
  id: string;
}
