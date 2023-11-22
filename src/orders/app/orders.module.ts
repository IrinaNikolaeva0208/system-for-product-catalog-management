import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { options } from 'src/utils/database/ormconfig';
import { Order } from 'src/utils/entities';
import { BuyerResolver } from './buyer.resolver';
import { ProductResolver } from './product.resolver';
import { SessionSerializer } from 'src/utils/strategies/session.serializer';
import { AccessStrategy } from 'src/utils/strategies/access.strategy';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { formatError } from 'src/utils/helpers/formatError';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import responseCachePlugin from '@apollo/server-plugin-response-cache';

@Module({
  imports: [
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
    TypeOrmModule.forRoot(options),
    TypeOrmModule.forFeature([Order]),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      typePaths: ['dist/app/order.graphql'],
      plugins: [
        ApolloServerPluginCacheControl({
          defaultMaxAge: +process.env.REDIS_DEFAULT_TTL,
        }),
        responseCachePlugin(),
      ],
      context: ({ req }) => ({ req }),
      formatError,
    }),
  ],
  providers: [
    OrdersResolver,
    OrdersService,
    BuyerResolver,
    ProductResolver,
    SessionSerializer,
    AccessStrategy,
  ],
})
export class OrdersModule {}
