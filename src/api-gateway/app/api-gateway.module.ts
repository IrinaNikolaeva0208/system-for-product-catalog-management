import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CATALOG_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'catalog',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'catalog-consumer',
          },
        },
      },
      {
        name: 'AUTH_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'auth-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class ApiGatewayModule {}
