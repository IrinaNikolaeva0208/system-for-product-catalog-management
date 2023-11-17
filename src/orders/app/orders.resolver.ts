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
import { Order, User, Product } from 'src/utils/entities';

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

  @ResolveField((of) => User)
  buyer(@Parent() order: Order) {
    return { __typename: 'User', id: post.authorId };
  }

  @ResolveField((of) => Product)
  product(@Parent() order: Order) {
    return { __typename: 'User', id: post.authorId };
  }
}
