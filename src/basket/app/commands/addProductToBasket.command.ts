import { Basket, Product } from 'src/utils/entities';

export class AddProductToBasketCommand {
  constructor(
    public readonly productId: string,
    public readonly basket: Basket,
  ) {}
}
