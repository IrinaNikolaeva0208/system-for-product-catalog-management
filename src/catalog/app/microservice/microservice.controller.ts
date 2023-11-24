import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CatalogService } from '../catalog.service';

@Controller()
export class MicroserviceController {
  constructor(private readonly catalogService: CatalogService) {}

  @MessagePattern('product.byId')
  async getProductById(@Payload() id: string) {
    try {
      return JSON.stringify(await this.catalogService.getById(id));
    } catch (err) {
      throw new RpcException(err);
    }
  }
}
