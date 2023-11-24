import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { Product } from 'src/utils/entities';

@Injectable()
export class ProductService implements OnModuleInit {
  constructor(
    @Inject('CATALOG_MICROSERVICE') private readonly catalogClient: ClientKafka,
  ) {}

  async checkIfProductExists(productId: string) {
    await new Promise<any>((resolve, reject) =>
      this.catalogClient.send('product.byId', productId).subscribe(
        (product: Product) => {
          resolve(product);
        },
        (err) => reject(new RpcException(err.response)),
      ),
    );
  }

  onModuleInit() {
    this.catalogClient.subscribeToResponseOf('product.byId');
  }
}
