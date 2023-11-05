import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductDto } from 'src/utils/dto/product.dto';
import { NotFoundException } from '@nestjs/common/exceptions';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getAll() {
    return JSON.stringify(await this.productRepository.find());
  }

  async getById(id: string) {
    const productToGet = await this.productRepository.findOneBy({ id });
    if (!productToGet)
      throw new RpcException(new NotFoundException('Product not found'));
    return JSON.stringify(productToGet);
  }

  async create(product: ProductDto) {
    const createdProduct = this.productRepository.create(product);
    return JSON.stringify(await this.productRepository.save(createdProduct));
  }

  async update(id: string, updates: Partial<ProductDto>) {
    const productToUpdate = await this.getById(id);
    return JSON.stringify(
      await this.productRepository.save({
        ...JSON.parse(productToUpdate),
        ...updates,
      }),
    );
  }

  async delete(id: string) {
    const deleteAlbumResult = await this.productRepository.delete(id);
    if (!deleteAlbumResult.affected)
      throw new RpcException(new NotFoundException('Product not found'));
  }
}
