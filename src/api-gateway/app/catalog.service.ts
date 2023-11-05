import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { ProductDto } from 'src/utils/dto/product.dto';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class CatalogService implements OnModuleInit {
  constructor(
    @Inject('CATALOG_MICROSERVICE') private readonly catalogClient: ClientKafka,
  ) {}

  getAllProducts() {
    return this.catalogClient
      .send('product.all', '')
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  getProductById(id: string) {
    return this.catalogClient
      .send('product.byId', id)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  createProduct(product: ProductDto) {
    return this.catalogClient
      .send('product.create', product)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  updateProduct(id: string, product: Partial<ProductDto>) {
    return this.catalogClient
      .send('product.update', { id, ...product })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  async deleteProduct(id: string) {
    return this.catalogClient
      .send('product.delete', id)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  onModuleInit() {
    const productTopics = [
      'product.all',
      'product.create',
      'product.byId',
      'product.delete',
      'product.update',
    ];
    productTopics.forEach((topic) =>
      this.catalogClient.subscribeToResponseOf(topic),
    );
  }
}
