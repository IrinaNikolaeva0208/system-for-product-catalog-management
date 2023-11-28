import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, Product } from 'src/utils/entities';
import { PaymentStatus } from 'src/utils/enums/paymentStatus.enum';
import { StripeService } from './payment.service';
import Stripe from 'stripe';
import { choosePaymentStatus } from '../helpers/changePaymentStatus';
import { ProductService } from './product.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private stripeService: StripeService,
    private productService: ProductService,
  ) {}

  async getById(id: string, userId: string) {
    const requiredOrder = await this.ordersRepository.findOne({
      where: { id },
      relations: { buyer: true, product: true },
    });

    if (!requiredOrder) throw new NotFoundException('Order not found');
    if (
      requiredOrder.buyer.id != userId &&
      requiredOrder.product.ownerId != userId
    )
      throw new ForbiddenException('Forbidden resource');

    return requiredOrder;
  }

  async getProductOrdersIfOwner(productId: string, ownerId: string) {
    const requiredOrders = await this.getProductOrders(productId);
    if (requiredOrders[0].product.ownerId != ownerId)
      throw new ForbiddenException('Forbidden resource');

    return requiredOrders;
  }

  async create(productId: string, userId: string) {
    await this.productService.checkIfProductExists(productId);

    const newOrder = this.ordersRepository.create({
      buyer: { id: userId },
      product: { id: productId },
      paymentStatus: PaymentStatus.Created,
    });

    await this.ordersRepository.save(newOrder);

    const createdOrder = await this.getById(newOrder.id, userId);
    await this.stripeService.createPaymentIntent(
      createdOrder.id,
      createdOrder.product.price,
    );

    return createdOrder;
  }

  async changePaymentStatus(event: Stripe.Event) {
    const orderId = (event.data.object as any)['metadata'].orderId;

    const order = (await this.ordersRepository.findOne({
      where: { id: orderId },
    })) as Order;

    const updateResult = await this.ordersRepository.update(
      order.id,
      choosePaymentStatus(order, event.type),
    );

    if (updateResult.affected === 1) {
      return `Record successfully updated with Payment Status ${order.paymentStatus}`;
    } else {
      throw new UnprocessableEntityException(
        'The payment was not successfully updated',
      );
    }
  }

  async getUserOrders(id: string) {
    return await this.ordersRepository.find({
      where: { buyer: { id } },
      relations: { buyer: true, product: true },
    });
  }

  async getProductOrders(id: string) {
    return await this.ordersRepository.find({
      where: { product: { id } },
      relations: { buyer: true, product: true },
    });
  }
}
