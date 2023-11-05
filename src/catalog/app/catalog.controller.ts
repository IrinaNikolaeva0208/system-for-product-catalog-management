import { Controller, Patch, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { ProductDto } from 'src/utils/dto/product.dto';
import { Payload, MessagePattern } from '@nestjs/microservices';

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @MessagePattern('product.all')
  async getAllProducts() {
    return await this.catalogService.getAll();
  }

  @MessagePattern('product.byId')
  async getProductById(@Payload() id: string) {
    return await this.catalogService.getById(id);
  }

  @MessagePattern('product.create')
  async createProduct(@Payload() productDto: ProductDto) {
    return await this.catalogService.create(productDto);
  }

  @MessagePattern('product.update')
  async updateProduct(@Payload() updateDto: ProductDto & { id: string }) {
    const { id, ...updateProductDto } = updateDto;
    return await this.catalogService.update(id, updateProductDto);
  }

  @MessagePattern('product.delete')
  async deleteProduct(@Payload() id: string) {
    await this.catalogService.delete(id);
  }
}
