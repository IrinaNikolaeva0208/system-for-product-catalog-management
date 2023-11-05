import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { CatalogModule } from './catalog.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(CatalogModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'catalog-consumer',
      },
    },
  });
  app.listen();
}
bootstrap();
