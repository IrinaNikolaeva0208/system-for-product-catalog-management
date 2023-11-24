import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetBasketQuery } from './queries';
import {
  CreateBasketCommand,
  AddProductToBasketCommand,
  RemoveProductFromBasketCommand,
} from './commands';

@Injectable()
export class BasketService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async addProduct(id: string, userId: string) {
    const basket = await this.getBasket(userId);
    return this.commandBus.execute(new AddProductToBasketCommand(id, basket));
  }

  async removeProduct(id: string, userId: string) {
    const basket = await this.getBasket(userId);
    return this.commandBus.execute(
      new RemoveProductFromBasketCommand(id, basket),
    );
  }

  async getBasket(userId: string) {
    const basket = await this.queryBus.execute(new GetBasketQuery(userId));
    if (basket) return basket;

    await this.commandBus.execute(new CreateBasketCommand(userId));
    return await this.queryBus.execute(new GetBasketQuery(userId));
  }
}
