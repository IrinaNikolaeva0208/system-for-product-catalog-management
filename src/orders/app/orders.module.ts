import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { BuyerResolver, OrdersResolver, ProductResolver } from './resolvers';
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
          defaultMaxAge: +(env.REDIS_DEFAULT_TTL as string),
        }),
        responseCachePlugin(),
      ],
      context: ({ req }: { req: any }) => ({ req }),
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
