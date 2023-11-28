import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketResolver } from './basket.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriverConfig,
  ApolloFederationDriver,
} from '@nestjs/apollo';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Basket } from 'src/utils/entities';
import { options } from 'src/utils/database/ormconfig';
import { AccessStrategy, SessionSerializer } from 'src/utils/strategies';
import { formatError } from 'src/utils/helpers/formatError';
import { CqrsModule } from '@nestjs/cqrs';
import {
  AddProductToBasketHandler,
  CreateBasketHandler,
  RemoveProductFromBasketHandler,
  GetBasketHandler,
} from './handlers';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import responseCachePlugin from '@apollo/server-plugin-response-cache';
import Keyv = require('keyv');
import { KeyvAdapter } from '@apollo/utils.keyvadapter';
import { env } from 'src/utils/env';

@Module({
  imports: [
    CqrsModule,
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      cache: new KeyvAdapter(
        new Keyv(`redis://${env.REDIS_HOST}:${env.REDIS_PORT}`),
      ),
      plugins: [
        ApolloServerPluginCacheControl({
          defaultMaxAge: +(env.REDIS_DEFAULT_TTL as string),
        }),
        responseCachePlugin(),
      ],
      typePaths: ['dist/app/basket.graphql'],
      context: ({ req }: { req: any }) => ({ req }),
      formatError,
    }),
    TypeOrmModule.forRoot(options),
    TypeOrmModule.forFeature([Basket]),
    ClientsModule.register([
      {
        name: 'CATALOG_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'catalog-basket',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'catalog-consumer',
          },
        },
      },
    ]),
  ],
  providers: [
    BasketResolver,
    BasketService,
    AccessStrategy,
    SessionSerializer,
    AddProductToBasketHandler,
    CreateBasketHandler,
    RemoveProductFromBasketHandler,
    GetBasketHandler,
  ],
})
export class BasketModule {}
