import { Field, ID, ObjectType, Directive } from '@nestjs/graphql';
import { Order } from './order.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class User {
  @Field((type) => ID)
  id: string;

  @Field((type) => [Order])
  orders?: Order[];
}
