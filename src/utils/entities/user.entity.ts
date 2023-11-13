import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql/dist';
import { Role } from 'src/utils/enums/role.enum';
import { Product } from 'src/utils/entities';

@ObjectType()
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
}
