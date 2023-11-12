import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CatalogService } from './catalog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/utils/entities';
import { options } from 'src/utils/database/ormconfig';
import { GraphQLModule } from '@nestjs/graphql/dist';
import { AccessStrategy } from 'src/utils/strategies/access.strategy';
import {
  ApolloFederationDriverConfig,
  ApolloFederationDriver,
} from '@nestjs/apollo';
import { CatalogResolver } from './catalog.resolver';
import { AccessGuard, RolesGuard } from 'src/utils/guards';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
      context: ({ req }) => ({ req }),
    }),
    TypeOrmModule.forRoot(options),
    TypeOrmModule.forFeature([Product]),
  ],
  providers: [
    CatalogService,
    CatalogResolver,
    AccessStrategy,
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class CatalogModule {}
