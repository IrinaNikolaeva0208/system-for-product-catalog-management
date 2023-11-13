import { Product, User, DeletedId } from 'src/utils/entities';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { CatalogService } from './catalog.service';
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql/dist';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Roles, Public, CurrentUser } from 'src/utils/decorators';
import { Role } from 'src/utils/enums/role.enum';
import { AccessGuard, AuthenticatedGuard, RolesGuard } from 'src/utils/guards';

@UseGuards(AccessGuard, AuthenticatedGuard)
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

  @UseGuards(RolesGuard)
  @Roles(Role.Seller)
  @Mutation(() => Product)
  async createProduct(
    @Args('createProductInput') productInput: CreateProductInput,
    @CurrentUser() user: User,
  ) {
    return await this.catalogService.create(productInput, user);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Seller)
  @Mutation(() => Product)
  async updateProduct(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @Args('updateProductInput') productInput: UpdateProductInput,
    @CurrentUser() user: User,
  ) {
    return await this.catalogService.update(id, productInput, user);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Seller, Role.Admin)
  @Mutation(() => DeletedId)
  async deleteProduct(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return await this.catalogService.delete(id, user);
  }
}
