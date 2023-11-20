import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddProductToBasketCommand } from '../commands';
import { Basket, Product } from 'src/utils/entities';

@CommandHandler(AddProductToBasketCommand)
export class AddProductToBasketHandler
  implements ICommandHandler<AddProductToBasketCommand>, OnModuleInit
{
  constructor(
    @Inject('CATALOG_MICROSERVICE') private readonly catalogClient: ClientKafka,
    @InjectRepository(Basket)
    private readonly basketRepository: Repository<Basket>,
  ) {}

  async execute(query: AddProductToBasketCommand) {
    const { productId, basket } = query;

    const newBasket = await new Promise<any>((resolve, reject) =>
      this.catalogClient.send('product.byId', productId).subscribe(
        (product: Product) => {
          if (!basket.products.find((pr) => pr.id == productId))
            basket.products.push(product);
          resolve(basket);
        },
        (err) => reject(new RpcException(err.response)),
      ),
    );

    return await this.basketRepository.save(newBasket);
  }

  onModuleInit() {
    this.catalogClient.subscribeToResponseOf('product.byId');
  }
}
