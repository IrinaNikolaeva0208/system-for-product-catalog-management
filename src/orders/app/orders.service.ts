import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {
  get() {}

  create(productId: string) {
    return 'This action adds a new order';
  }

  changeStatus() {
    return `This action returns all orders`;
  }

  getUserOrders(id: string) {}

  getProductOrders(id: string) {}
}
