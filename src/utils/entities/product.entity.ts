import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID, Float, Directive } from '@nestjs/graphql/dist';
import { User, Basket, Order } from 'src/utils/entities';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity()
export class Product {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ nullable: true })
  description: string;

  @Field(() => Float)
  @Column()
  price: number;

  @Field()
  @Column()
  category: string;

  @Field()
  @Column()
  ownerId: string;

  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  owner: User;

  @ManyToMany(() => Basket, (basket) => basket.products)
  baskets: Basket[];

  @OneToMany(() => Order, (order) => order.product)
  orders: Order[];
}
