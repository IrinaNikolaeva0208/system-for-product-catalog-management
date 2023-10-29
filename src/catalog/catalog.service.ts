import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductDto } from './dto/product.dto';
import { NotFoundException } from '@nestjs/common/exceptions';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getAll() {
    return await this.productRepository.find();
  }

  async getById(id: string) {
    const productToGet = await this.productRepository.findOneBy({ id });
    if (!productToGet) throw new NotFoundException('Product not found');
    return productToGet;
  }

  async create(product: ProductDto) {
    const createdAlbum = this.productRepository.create(product);
    return await this.productRepository.save(createdAlbum);
  }

  async update(id: string, updates: Partial<ProductDto>) {
    const productToUpdate = await this.getById(id);
    return await this.productRepository.save({ productToUpdate, ...updates });
  }

  async delete(id: string) {
    const deleteAlbumResult = await this.productRepository.delete(id);
    if (!deleteAlbumResult.affected)
      throw new NotFoundException('Product not found');
  }
}
