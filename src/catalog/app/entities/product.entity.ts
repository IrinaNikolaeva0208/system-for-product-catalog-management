import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql/dist';

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
}
