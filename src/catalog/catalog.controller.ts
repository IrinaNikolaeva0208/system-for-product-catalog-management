import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { ProductDto } from './dto/product.dto';

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  async getAllProducts() {}

  @Get(':id')
  async getProductById(@Param('id', ParseUUIDPipe) id: string) {}

  @Post()
  async createProduct(@Body() productDto: ProductDto) {}

  @Patch(':id')
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() productDto: Partial<ProductDto>,
  ) {}

  @Delete(':id')
  async deleteProduct(@Param('id', ParseUUIDPipe) id: string) {}
}
