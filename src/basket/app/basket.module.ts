import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketResolver } from './basket.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriverConfig,
  ApolloFederationDriver,
} from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Basket } from 'src/utils/entities';
import { options } from 'src/utils/database/ormconfig';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      typePaths: ['dist/app/basket.graphql'],
      context: ({ req }) => ({ req }),
    }),
    TypeOrmModule.forRoot(options),
    TypeOrmModule.forFeature([Basket]),
  ],
  providers: [BasketResolver, BasketService],
})
export class BasketModule {}
