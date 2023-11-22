import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { BasketService } from './basket.service';
import { User } from 'src/utils/entities';
import { CurrentUser } from 'src/utils/decorators';
import { AccessGuard, AuthenticatedGuard } from 'src/utils/guards';
import { CacheControl } from 'nestjs-gql-cache-control';

@UseGuards(AccessGuard, AuthenticatedGuard)
@Resolver('Basket')
export class BasketResolver {
  constructor(private readonly basketService: BasketService) {}

  @Query()
  @CacheControl({ inheritMaxAge: true })
  basket(@CurrentUser() user: User) {
    return this.basketService.getBasket(user.id);
  }

  @Mutation()
  addToBasket(
    @Args('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.basketService.addProduct(id, user.id);
  }

  @Mutation()
  removeFromBasket(
    @Args('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.basketService.removeProduct(id, user.id);
  }
}
