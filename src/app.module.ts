import { Module } from '@nestjs/common';
import { CatalogModule } from './catalog/catalog.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { options } from './database/ormconfig';

@Module({
  imports: [CatalogModule, TypeOrmModule.forRoot(options)],
})
export class AppModule {}
