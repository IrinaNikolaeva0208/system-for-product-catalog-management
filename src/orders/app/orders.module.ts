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
import { User as OrderBuyer, Order, Product as OrderProduct } from './entities';
import { BuyerResolver } from './buyer.resolver';
import { ProductResolver } from './product.resolver';

@Module({
  imports: [
    TypeOrmModule.forRoot(options),
    TypeOrmModule.forFeature([Order]),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
      buildSchemaOptions: {
        orphanedTypes: [OrderBuyer, OrderProduct],
      },
      context: ({ req }) => ({ req }),
    }),
  ],
  providers: [OrdersResolver, OrdersService, BuyerResolver, ProductResolver],
})
export class OrdersModule {}
