import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';
import { User } from 'src/utils/entities';
import { OrderStatus } from 'src/utils/enums/orderStatus.enum';
import { Product } from 'src/utils/entities';
import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Entity,
} from 'typeorm';
import { User as OrderBuyer } from './orderBuyer.entity';
import { Product as OrderProduct } from './orderProduct.entity';

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
  status: OrderStatus;
}
