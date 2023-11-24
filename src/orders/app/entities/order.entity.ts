import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';
import { User as OrderBuyer } from './orderBuyer.entity';
import { Product as OrderProduct } from './orderProduct.entity';
import { PaymentStatus } from 'src/utils/enums';

@ObjectType()
@Directive('@key(fields: "id")')
export class Order {
  @Field(() => ID)
  id: string;

  @Field((type) => OrderBuyer)
  buyer: OrderBuyer;

  @Field((type) => OrderProduct)
  product: OrderProduct;

  @Field()
  status: PaymentStatus;
}
