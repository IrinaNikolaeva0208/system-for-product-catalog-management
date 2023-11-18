import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ObjectType, Field, ID, Directive } from '@nestjs/graphql/dist';
import { Role } from 'src/utils/enums/role.enum';
import { Basket, Product, Order } from 'src/utils/entities';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  login: string;

  @Field()
  @Column()
  role: Role;

  @Column()
  password: string;

  @OneToMany(() => Product, (product) => product.owner)
  products: Product[];

  @OneToOne(() => Basket, (basket) => basket.user)
  basket: Basket;

  @OneToMany(() => Order, (order) => order.buyer)
  orders: Order[];
}
