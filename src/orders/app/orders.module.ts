import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BuyerResolver, OrdersResolver, ProductResolver } from './resolvers';
import { SessionSerializer } from 'src/utils/strategies/session.serializer';
import { AccessStrategy } from 'src/utils/strategies/access.strategy';
import { formatError } from 'src/utils/helpers/formatError';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import responseCachePlugin from '@apollo/server-plugin-response-cache';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PaymentModule,
    GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        typePaths: ['dist/app/order.graphql'],
        plugins: [
          ApolloServerPluginCacheControl({
            defaultMaxAge: configService.get<number>('REDIS_DEFAULT_TTL'),
          }),
          responseCachePlugin(),
        ],
        context: ({ req }: { req: any }) => ({ req }),
        formatError,
      }),
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
