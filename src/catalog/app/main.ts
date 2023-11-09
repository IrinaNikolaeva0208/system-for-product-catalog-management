import { NestFactory } from '@nestjs/core';
import { CatalogModule } from './catalog.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(CatalogModule);
  app.useGlobalPipes(new ValidationPipe());
  app.listen(3001);
}
bootstrap();
