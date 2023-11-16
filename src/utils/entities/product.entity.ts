import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql/dist';
import { User, Basket } from 'src/utils/entities';

@ObjectType()
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
}
