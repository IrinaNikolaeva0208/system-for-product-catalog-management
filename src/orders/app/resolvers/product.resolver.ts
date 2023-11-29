import { Product as OrderProduct, Order } from '../entities';
import { ResolveField, Resolver, Parent } from '@nestjs/graphql';
import { OrdersService } from '../services/orders.service';

@Resolver()
export class ProductResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @ResolveField((of) => [Order])
  public orders(@Parent() product: OrderProduct) {
    return this.ordersService.getProductOrders(product.id);
  }
}
