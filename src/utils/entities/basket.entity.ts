import { Product, User } from 'src/utils/entities';
import {
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToMany,
  Entity,
  JoinColumn,
  JoinTable,
  Column,
} from 'typeorm';

@Entity()
export class Basket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.basket)
  @JoinColumn()
  user: User;

  @ManyToMany(() => Product, (product) => product.baskets, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'basket_products',
    joinColumn: {
      name: 'productId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'basketId',
      referencedColumnName: 'id',
    },
  })
  products: Product[];
}
