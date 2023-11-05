import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { ProductDto } from 'src/utils/dto/product.dto';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  getAll() {
    return this.catalogService.getAllProducts();
  }

  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.catalogService.getProductById(id);
  }

  @Post()
  create(@Body() product: ProductDto) {
    return this.catalogService.createProduct(product);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() productDto: Partial<ProductDto>,
  ) {
    return this.catalogService.updateProduct(id, productDto);
  }

  @HttpCode(204)
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.catalogService.deleteProduct(id);
  }
}
