import { User, Product } from 'src/utils/entities';
import { PaymentStatus } from 'src/utils/enums';
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
  paymentStatus: PaymentStatus;
}
