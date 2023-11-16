import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from 'src/utils/entities';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation(() => Order)
  createOrder(@Args('productId', ParseUUIDPipe) productId: string) {
    return this.ordersService.create(productId);
  }

  @Query(() => [Order], { name: 'orders' })
  getOrder() {
    return this.ordersService.get();
  }

  @Mutation(() => Order)
  changeOrderStatus() {
    return this.ordersService.changeStatus();
  }
}
