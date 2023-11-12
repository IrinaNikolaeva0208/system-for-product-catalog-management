import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { CatalogService } from './catalog.service';
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql/dist';
import { DeletedId } from './entities/deletedId.entity';
import { ParseUUIDPipe } from '@nestjs/common';
import { Roles, Public } from 'src/utils/decorators';
import { Role } from 'src/utils/enums/role.enum';

@Resolver(() => Product)
export class CatalogResolver {
  constructor(private readonly catalogService: CatalogService) {}

  @Public()
  @Query(() => [Product])
  async getAllProducts() {
    return await this.catalogService.getAll();
  }

  @Public()
  @Query(() => Product)
  async getProductById(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ) {
    return await this.catalogService.getById(id);
  }

  @Roles(Role.Seller)
  @Mutation(() => Product)
  async createProduct(
    @Args('createProductInput') productInput: CreateProductInput,
  ) {
    return await this.catalogService.create(productInput);
  }

  @Roles(Role.Seller)
  @Mutation(() => Product)
  async updateProduct(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @Args('updateProductInput') productInput: UpdateProductInput,
  ) {
    return await this.catalogService.update(id, productInput);
  }

  @Roles(Role.Seller, Role.Admin)
  @Mutation(() => DeletedId)
  async deleteProduct(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ) {
    return await this.catalogService.delete(id);
  }
}
