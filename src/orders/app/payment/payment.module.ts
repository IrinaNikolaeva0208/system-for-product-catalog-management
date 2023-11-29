import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { options } from 'src/utils/database/ormconfig';
import { Order } from 'src/utils/entities';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PaymentController } from './payment.controller';
import { OrdersService, ProductService, StripeService } from '../services';
import { StripeModule } from 'nestjs-stripe';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(options),
    TypeOrmModule.forFeature([Order]),
    StripeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get<string>('STRIPE_API_KEY'),
        apiVersion: '2023-10-16',
      }),
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
