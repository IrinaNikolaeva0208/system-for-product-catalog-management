import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards, ParseEnumPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order, User as OrderBuyer, Product as OrderProduct } from './entities';
import { AccessGuard, AuthenticatedGuard, RolesGuard } from 'src/utils/guards';
import { CurrentUser, Roles } from 'src/utils/decorators';
import { Role } from 'src/utils/enums/role.enum';
import { User } from 'src/utils/entities';
import { OrderStatus } from 'src/utils/enums/orderStatus.enum';
import { CacheControl } from 'nestjs-gql-cache-control';

@UseGuards(AccessGuard, AuthenticatedGuard)
@Resolver('Order')
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation()
  createOrder(
    @Args('productId', ParseUUIDPipe) productId: string,
    @CurrentUser() user: User,
  ) {
    return this.ordersService.create(productId, user.id);
  }

  @Query()
  @CacheControl({ inheritMaxAge: true })
  order(@Args('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.ordersService.getById(id, user.id);
  }

  @Query()
  @CacheControl({ inheritMaxAge: true })
  orders(@CurrentUser() user: User) {
    return this.ordersService.getUserOrders(user.id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Seller)
  @Query()
  @CacheControl({ inheritMaxAge: true })
  productOrders(
    @Args('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.ordersService.getProductOrdersIfOwner(id, user.id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Seller)
  @Mutation()
  changeOrderStatus(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('status', new ParseEnumPipe(OrderStatus)) status: OrderStatus,
    @CurrentUser() user: User,
  ) {
    return this.ordersService.changeStatus(id, status, user.id);
  }

  @ResolveField('buyer')
  buyer(@Parent() order: Order) {
    return { __typename: 'User', id: order.buyer.id };
  }

  @ResolveField('product')
  product(@Parent() order: Order) {
    return { __typename: 'Product', id: order.product.id };
  }
}
