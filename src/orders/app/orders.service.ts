import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnprocessableEntityException,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, Product } from 'src/utils/entities';
import { PaymentStatus } from 'src/utils/enums/paymentStatus.enum';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { StripeService } from './payment.service';
import Stripe from 'stripe';

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @Inject('CATALOG_MICROSERVICE') private readonly catalogClient: ClientKafka,
    private stripeService: StripeService,
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
    const requiredProduct = await new Promise<any>((resolve, reject) =>
      this.catalogClient.send('product.byId', productId).subscribe(
        (product: Product) => {
          resolve(product);
        },
        (err) => reject(new RpcException(err.response)),
      ),
    );

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
    const orderId = event.data.object['metadata'].orderId;

    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
    });

    switch (event.type) {
      case 'payment_intent.succeeded':
        order.paymentStatus = PaymentStatus.Succeded;
        break;

      case 'payment_intent.processing':
        order.paymentStatus = PaymentStatus.Processing;
        break;

      case 'payment_intent.payment_failed':
        order.paymentStatus = PaymentStatus.Failed;
        break;

      default:
        order.paymentStatus = PaymentStatus.Created;
        break;
    }

    const updateResult = await this.ordersRepository.update(order.id, order);

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

  onModuleInit() {
    this.catalogClient.subscribeToResponseOf('product.byId');
  }
}
