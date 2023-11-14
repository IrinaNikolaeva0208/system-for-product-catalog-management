import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Basket } from 'src/utils/entities';

@Injectable()
export class BasketService {
  constructor(
    @InjectRepository(Basket)
    private readonly basketRepository: Repository<Basket>,
  ) {}

  getBasket() {
    return 'This action adds a new basket';
  }

  addProduct(id: string) {
    return `This action returns all basket`;
  }

  removeProduct(id: string) {
    return `This action returns a #${id} basket`;
  }
}
