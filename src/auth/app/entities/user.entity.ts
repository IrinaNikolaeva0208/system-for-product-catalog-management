import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql/dist';
import { Role } from 'src/utils/enums/role.enum';

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
}
