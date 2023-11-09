import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { options } from 'src/utils/database/ormconfig';
import { GraphQLModule } from '@nestjs/graphql/dist';
import { AccessStrategy } from 'src/utils/strategies/access.strategy';
import {
  ApolloFederationDriverConfig,
  ApolloFederationDriver,
} from '@nestjs/apollo';
import { CatalogResolver } from './catalog.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
      formatError: (error) => {
        const originalError = (error.extensions?.originalError as any) || error;

        return {
          message: originalError.message || originalError.stacktrace,
          statusCode: originalError.statusCode || 500,
        };
      },
    }),
    TypeOrmModule.forRoot(options),
    TypeOrmModule.forFeature([Product]),
  ],
  providers: [CatalogService, CatalogResolver, AccessStrategy],
})
export class CatalogModule {}
