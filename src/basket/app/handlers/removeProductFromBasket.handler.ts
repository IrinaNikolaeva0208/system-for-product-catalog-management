import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RemoveProductFromBasketCommand } from '../commands';
import { Basket } from 'src/utils/entities';

@CommandHandler(RemoveProductFromBasketCommand)
export class RemoveProductFromBasketHandler
  implements ICommandHandler<RemoveProductFromBasketCommand>
{
  constructor(
    @InjectRepository(Basket)
    private readonly basketRepository: Repository<Basket>,
  ) {}

  async execute(query: RemoveProductFromBasketCommand) {
    const { productId, basket } = query;

    const productIndex = basket.products.findIndex(
      (prod) => prod.id == productId,
    );
    if (!(productIndex + 1))
      throw new NotFoundException('No such product in basket');
    basket.products.splice(productIndex, 1);
    return await this.basketRepository.save(basket);
  }
}
