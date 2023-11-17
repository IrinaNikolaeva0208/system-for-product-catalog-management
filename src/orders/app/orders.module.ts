import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { options } from 'src/utils/database/ormconfig';
import { Order } from 'src/utils/entities';

@Module({
  imports: [
    TypeOrmModule.forRoot(options),
    TypeOrmModule.forFeature([Order]),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
      context: ({ req }) => ({ req }),
    }),
  ],
  providers: [OrdersResolver, OrdersService],
})
export class OrdersModule {}
