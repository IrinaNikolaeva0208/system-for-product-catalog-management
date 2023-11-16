import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Basket, Product } from 'src/utils/entities';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class BasketService {
  constructor(
    @InjectRepository(Basket)
    private readonly basketRepository: Repository<Basket>,
    @Inject('CATALOG_MICROSERVICE') private readonly catalogClient: ClientKafka,
  ) {}

  async addProduct(id: string, userId: string) {
    const basket = await this.getBasket(userId);

    const newBasket = await new Promise<any>((resolve, reject) =>
      this.catalogClient.send('product.byId', id).subscribe(
        (product: Product) => {
          if (!basket.products.find((pr) => pr.id == id))
            basket.products.push(product);
          resolve(basket);
        },
        (err) => reject(new RpcException(err.response)),
      ),
    );

    return await this.basketRepository.save(newBasket);
  }

  async removeProduct(id: string, userId: string) {
    const basket = await this.getBasket(userId);
    const productIndex = basket.products.findIndex((prod) => prod.id == id);
    if (!(productIndex + 1))
      throw new NotFoundException('No such product in basket');
    basket.products.splice(productIndex, 1);
    return await this.basketRepository.save(basket);
  }

  async getBasket(userId: string) {
    const existingBasket = await this.basketRepository.findOne({
      where: { user: { id: userId } },
      relations: { products: true },
    });

    if (existingBasket) return existingBasket;
    const newBasket = this.basketRepository.create({
      user: { id: userId },
    });
    const { id } = await this.basketRepository.save(newBasket);

    return await this.basketRepository.findOne({
      where: { id },
      relations: { products: true },
    });
  }

  onModuleInit() {
    this.catalogClient.subscribeToResponseOf('product.byId');
  }
}
