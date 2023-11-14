import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import { BasketService } from './basket.service';
import { Basket } from './entities/basket.entity';

@Resolver('Basket')
export class BasketResolver {
  constructor(private readonly basketService: BasketService) {}

  @Query()
  basket() {
    return this.basketService.getAllProducts();
  }

  @Mutation()
  addToBasket(@Args('id', ParseUUIDPipe) id: string) {
    return this.basketService.addProduct(id);
  }

  @Mutation()
  removeFromBasket(@Args('id', ParseUUIDPipe) id: string) {
    return this.basketService.removeProduct(id);
  }

  @ResolveField('products')
  getProducts(@Parent() basket: Basket) {
    return basket.products.map((item) => {
      return { __typename: 'Product', id: item };
    });
  }
}
