import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { options } from 'src/utils/database/ormconfig';
import { Order } from 'src/utils/entities';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PaymentController } from './payment.controller';
import { OrdersService, ProductService, StripeService } from '../services';
import { StripeModule } from 'nestjs-stripe';
import { env } from 'src/utils/env';

@Module({
  imports: [
    TypeOrmModule.forRoot(options),
    TypeOrmModule.forFeature([Order]),
    StripeModule.forRoot({
      apiKey: env.STRIPE_API_KEY,
      apiVersion: '2023-10-16',
    }),
    ClientsModule.register([
      {
        name: 'CATALOG_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'catalog-order',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'catalog-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [PaymentController],
  providers: [OrdersService, StripeService, ProductService],
  exports: [StripeService, OrdersService, ProductService],
})
export class PaymentModule {}
