import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { CatalogService } from './catalog.service';
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql/dist';
import { DeletedId } from './entities/deletedId.entity';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { AccessGuard } from 'src/utils/guards/access.guard';

@UseGuards(AccessGuard)
@Resolver(() => Product)
export class CatalogResolver {
  constructor(private readonly catalogService: CatalogService) {}

  @Query(() => [Product])
  async getAllProducts() {
    return await this.catalogService.getAll();
  }

  @Query(() => Product)
  async getProductById(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ) {
    return await this.catalogService.getById(id);
  }

  @Mutation(() => Product)
  async createProduct(
    @Args('createProductInput') productInput: CreateProductInput,
  ) {
    return await this.catalogService.create(productInput);
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @Args('updateProductInput') productInput: UpdateProductInput,
  ) {
    return await this.catalogService.update(id, productInput);
  }

  @Mutation(() => DeletedId)
  async deleteProduct(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ) {
    return await this.catalogService.delete(id);
  }
}
