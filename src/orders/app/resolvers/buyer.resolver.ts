import { User as OrderBuyer, Order } from '../entities';
import { ResolveField, Resolver, Parent } from '@nestjs/graphql';
import { OrdersService } from '../services/orders.service';

@Resolver((of) => OrderBuyer)
export class BuyerResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @ResolveField((of) => [Order])
  public orders(@Parent() buyer: OrderBuyer) {
    return this.ordersService.getUserOrders(buyer.id);
  }
}
