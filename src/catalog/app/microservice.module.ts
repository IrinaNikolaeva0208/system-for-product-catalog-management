import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { Product } from 'src/utils/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { options } from 'src/utils/database/ormconfig';
import { MicroserviceController } from './microservice.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(options),
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [MicroserviceController],
  providers: [CatalogService],
})
export class MicroserviceModule {}
