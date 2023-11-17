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

@Entity()
@ObjectType()
@Directive('@key(fields: "id")')
export class Order {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn()
  @Field((type) => OrderBuyer)
  buyer: OrderBuyer;

  @ManyToOne(() => Product)
  @JoinColumn()
  @Field((type) => OrderProduct)
  product: OrderProduct;

  @Column()
  @Field()
  status: OrderStatus;
}
