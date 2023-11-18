import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, Product } from 'src/utils/entities';
import { OrderStatus } from 'src/utils/enums/orderStatus.enum';
import { ClientKafka, RpcException } from '@nestjs/microservices';

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @Inject('CATALOG_MICROSERVICE') private readonly catalogClient: ClientKafka,
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
      status: OrderStatus.PaymentRequired,
    });
    return await this.ordersRepository.save(newOrder);
  }

  async changeStatus(id: string, status: OrderStatus, userId: string) {
    const requiredOrder = await this.ordersRepository.findOne({
      where: { id },
      relations: { buyer: true, product: true },
    });

    if (!requiredOrder) throw new NotFoundException('Order not found');
    if (requiredOrder.product.ownerId != userId)
      throw new ForbiddenException('Forbidden resource');

    requiredOrder.status = status;
    return await this.ordersRepository.save(requiredOrder);
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