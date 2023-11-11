import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { NotFoundException } from '@nestjs/common/exceptions';
import { UpdateProductInput } from './dto/update-product.input';

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
    console.log(productToGet);
    return productToGet;
  }

  async create(product: CreateProductInput) {
    const createdProduct = this.productRepository.create(product);
    return await this.productRepository.save(createdProduct);
  }

  async update(id: string, updates: UpdateProductInput) {
    const productToUpdate = await this.getById(id);
    return await this.productRepository.save({
      ...productToUpdate,
      ...updates,
    });
  }

  async delete(id: string) {
    const deleteAlbumResult = await this.productRepository.delete(id);
    if (!deleteAlbumResult.affected)
      throw new NotFoundException('Product not found');
    return { id };
  }
}
