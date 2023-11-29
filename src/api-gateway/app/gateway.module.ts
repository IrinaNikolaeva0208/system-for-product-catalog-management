import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { IntrospectAndCompose } from '@apollo/gateway/dist';
import { ApolloGatewayDriverConfig, ApolloGatewayDriver } from '@nestjs/apollo';
import { GraphQLDataSource } from './gql.datasource';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        gateway: {
          buildService: (args) => new GraphQLDataSource(args),
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              {
                name: 'auth',
                url: `http://auth:${configService.get<string>(
                  'AUTH_PORT',
                )}/graphql`,
              },
              {
                name: 'catalog',
                url: `http://catalog:${configService.get<string>(
                  'CATALOG_PORT',
                )}/graphql`,
              },
              {
                name: 'basket',
                url: `http://basket:${configService.get<string>(
                  'BASKET_PORT',
                )}/graphql`,
              },
              {
                name: 'orders',
                url: `http://orders:${configService.get<string>(
                  'ORDERS_PORT',
                )}/graphql`,
              },
            ],
          }),
        },
      }),
    }),
  ],
})
export class GatewayModule {}
