import { Module } from '@nestjs/common';
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
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from 'src/utils/strategies/session.serializer';

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
    PassportModule.register({ session: true }),
  ],
  providers: [
    CatalogService,
    CatalogResolver,
    AccessStrategy,
    SessionSerializer,
  ],
})
export class CatalogModule {}
