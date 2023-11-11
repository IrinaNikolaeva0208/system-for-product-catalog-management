import { Module } from '@nestjs/common';
import { config } from 'dotenv';
import { GraphQLModule } from '@nestjs/graphql';
import { IntrospectAndCompose } from '@apollo/gateway/dist';
import { ApolloGatewayDriverConfig, ApolloGatewayDriver } from '@nestjs/apollo';
import { GraphQLDataSource } from './gql.datasource';

config();

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
              url: `http://auth:${process.env.AUTH_PORT}/graphql`,
            },
            {
              name: 'catalog',
              url: `http://catalog:${process.env.CATALOG_PORT}/graphql`,
            },
          ],
        }),
      },
    }),
  ],
})
export class GatewayModule {}
