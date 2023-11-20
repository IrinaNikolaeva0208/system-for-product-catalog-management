import { Basket, Product } from 'src/utils/entities';

export class RemoveProductFromBasketCommand {
  constructor(
    public readonly productId: string,
    public readonly basket: Basket,
  ) {}
}
