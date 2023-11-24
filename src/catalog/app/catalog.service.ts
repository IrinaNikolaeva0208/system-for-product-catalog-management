import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, User } from 'src/utils/entities';
import { CreateProductInput } from './dto/create-product.input';
import { NotFoundException } from '@nestjs/common/exceptions';
import { UpdateProductInput } from './dto/update-product.input';
import { Role } from 'src/utils/enums/role.enum';

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

  async create(product: CreateProductInput, user: User) {
    const createdProduct = this.productRepository.create({
      ...product,
      owner: user,
    });
    return await this.productRepository.save(createdProduct);
  }

  async update(id: string, updates: UpdateProductInput, user: User) {
    const productToUpdate = await this.getById(id);

    if (productToUpdate.owner.id != user.id)
      throw new ForbiddenException('Update operation forbidden');

    return await this.productRepository.save({
      ...productToUpdate,
      ...updates,
    });
  }

  async delete(id: string, user: User) {
    const productToDelete = await this.getById(id);

    if (productToDelete.ownerId != user.id && user.role != Role.Admin)
      throw new ForbiddenException('Delete operation forbidden');

    await this.productRepository.delete({ id });
    return { id };
  }
}
