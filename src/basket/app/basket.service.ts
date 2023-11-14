import { Injectable } from '@nestjs/common';

@Injectable()
export class BasketService {
  getAllProducts() {
    return 'This action adds a new basket';
  }

  addProduct(id: string) {
    return `This action returns all basket`;
  }

  removeProduct(id: string) {
    return `This action returns a #${id} basket`;
  }
}
