import { Module } from '@nestjs/common';
import { OrdersResolver } from './orders.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { BuyerResolver } from './buyer.resolver';
import { ProductResolver } from './product.resolver';
import { SessionSerializer } from 'src/utils/strategies/session.serializer';
import { AccessStrategy } from 'src/utils/strategies/access.strategy';
import { formatError } from 'src/utils/helpers/formatError';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import responseCachePlugin from '@apollo/server-plugin-response-cache';
import { PaymentModule } from './payment/payment.module';
import { env } from 'src/utils/env';

@Module({
  imports: [
    PaymentModule,
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      typePaths: ['dist/app/order.graphql'],
      plugins: [
        ApolloServerPluginCacheControl({
          defaultMaxAge: +env.REDIS_DEFAULT_TTL,
        }),
        responseCachePlugin(),
      ],
      context: ({ req }) => ({ req }),
      formatError,
    }),
  ],
  providers: [
    OrdersResolver,
    BuyerResolver,
    ProductResolver,
    SessionSerializer,
    AccessStrategy,
  ],
})
export class OrdersModule {}
