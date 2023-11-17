import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order, User as OrderBuyer, Product as OrderProduct } from './entities';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation(() => Order)
  createOrder(@Args('productId', ParseUUIDPipe) productId: string) {
    return this.ordersService.create(productId);
  }

  @Query(() => [Order])
  getOrder() {
    return this.ordersService.get();
  }

  @Mutation(() => Order)
  changeOrderStatus() {
    return this.ordersService.changeStatus();
  }

  @ResolveField((of) => OrderBuyer)
  buyer(@Parent() order: Order) {
    return { __typename: 'User', id: order.buyer.id };
  }

  @ResolveField((of) => OrderProduct)
  product(@Parent() order: Order) {
    return { __typename: 'Product', id: order.product.id };
  }
}
