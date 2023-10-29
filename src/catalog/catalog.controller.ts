import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { ProductDto } from './dto/product.dto';

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  async getAllProducts() {
    return await this.catalogService.getAll();
  }

  @Get(':id')
  async getProductById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.catalogService.getById(id);
  }

  @Post()
  async createProduct(@Body() productDto: ProductDto) {
    return await this.catalogService.create(productDto);
  }

  @Patch(':id')
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() productDto: Partial<ProductDto>,
  ) {
    return await this.catalogService.update(id, productDto);
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    await this.catalogService.delete(id);
  }
}
