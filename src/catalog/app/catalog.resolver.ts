import { User, DeletedId } from 'src/utils/entities';
import { CreateProductInput, UpdateProductInput } from './dto';
import { CatalogService } from './catalog.service';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveReference,
} from '@nestjs/graphql/dist';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Roles, Public, CurrentUser } from 'src/utils/decorators';
import { Role } from 'src/utils/enums/role.enum';
import { AccessGuard, AuthenticatedGuard, RolesGuard } from 'src/utils/guards';
import { CacheControl } from 'nestjs-gql-cache-control';

@UseGuards(AccessGuard, AuthenticatedGuard)
@Resolver('Product')
export class CatalogResolver {
  constructor(private readonly catalogService: CatalogService) {}

  @Public()
  @Query()
  @CacheControl({ inheritMaxAge: true })
  getAllProducts() {
    return this.catalogService.getAll();
  }

  @Public()
  @Query()
  @CacheControl({ inheritMaxAge: true })
  getProductById(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.catalogService.getById(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Seller)
  @Mutation()
  createProduct(
    @Args('createProductInput') productInput: CreateProductInput,
    @CurrentUser() user: User,
  ) {
    return this.catalogService.create(productInput, user);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Seller)
  @Mutation()
  async updateProduct(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @Args('updateProductInput') productInput: UpdateProductInput,
    @CurrentUser() user: User,
  ) {
    return await this.catalogService.update(id, productInput, user);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Seller, Role.Admin)
  @Mutation()
  async deleteProduct(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return await this.catalogService.delete(id, user);
  }

  @ResolveReference()
  resolveReference(reference: { __typename: string; id: string }) {
    return this.catalogService.getById(reference.id);
  }
}
