import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { CatalogModule } from './catalog.module';
import { Logger } from '@nestjs/common';

const logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.createMicroservice(CatalogModule, {
    transport: Transport.TCP,
    options: {
      host: 'catalog',
      port: 3001,
    },
  });
  app.listen();
}
bootstrap();
