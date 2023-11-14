import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketResolver } from './basket.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriverConfig,
  ApolloFederationDriver,
} from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      typePaths: ['dist/app/basket.graphql'],
      context: ({ req }) => ({ req }),
    }),
  ],
  providers: [BasketResolver, BasketService],
})
export class BasketModule {}
