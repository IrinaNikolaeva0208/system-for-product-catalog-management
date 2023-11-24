import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { IntrospectAndCompose } from '@apollo/gateway/dist';
import { ApolloGatewayDriverConfig, ApolloGatewayDriver } from '@nestjs/apollo';
import { GraphQLDataSource } from './gql.datasource';
import { env } from 'src/utils/env';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      gateway: {
        buildService: (args) => new GraphQLDataSource(args),
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            {
              name: 'auth',
              url: `http://auth:${env.AUTH_PORT}/graphql`,
            },
            {
              name: 'catalog',
              url: `http://catalog:${env.CATALOG_PORT}/graphql`,
            },
            {
              name: 'basket',
              url: `http://basket:${env.BASKET_PORT}/graphql`,
            },
            {
              name: 'orders',
              url: `http://orders:${env.ORDERS_PORT}/graphql`,
            },
          ],
        }),
      },
    }),
  ],
})
export class GatewayModule {}
