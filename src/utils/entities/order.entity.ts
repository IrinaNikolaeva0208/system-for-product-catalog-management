import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from './user.entity';
import { OrderStatus } from '../enums/orderStatus.enum';
import { Product } from './product.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Entity,
} from 'typeorm';

@Entity()
@ObjectType()
export class Order {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  // @Field()
  buyer: User;

  @OneToOne(() => Product)
  @JoinColumn()
  //@Field()
  product: Product;

  @Column()
  @Field()
  status: OrderStatus;
}
