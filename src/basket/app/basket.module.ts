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
import { AccessStrategy } from 'src/utils/strategies/access.strategy';
import { SessionSerializer } from 'src/utils/strategies/session.serializer';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      typePaths: ['dist/app/basket.graphql'],
      context: ({ req }) => ({ req }),
    }),
    TypeOrmModule.forRoot(options),
    TypeOrmModule.forFeature([Basket]),
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
    ]),
  ],
  providers: [BasketResolver, BasketService, AccessStrategy, SessionSerializer],
})
export class BasketModule {}
