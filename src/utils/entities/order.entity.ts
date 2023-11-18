import { User, Product } from 'src/utils/entities';
import { OrderStatus } from 'src/utils/enums/orderStatus.enum';
import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Entity,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (buyer) => buyer.orders)
  @JoinColumn()
  buyer: User;

  @ManyToOne(() => Product, (product) => product.orders)
  @JoinColumn()
  product: Product;

  @Column()
  status: OrderStatus;
}
