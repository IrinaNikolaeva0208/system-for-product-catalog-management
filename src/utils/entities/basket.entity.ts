import { Product, User } from 'src/utils/entities';
import {
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToMany,
  Entity,
  JoinColumn,
  JoinTable,
} from 'typeorm';

@Entity()
export class Basket {
  @PrimaryGeneratedColumn()
  id: string;

  @OneToOne(() => User, (user) => user.basket)
  @JoinColumn()
  user: User;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];
}
