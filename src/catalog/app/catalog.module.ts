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
import { formatError } from 'src/utils/helpers/formatError';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import responseCachePlugin from '@apollo/server-plugin-response-cache';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      plugins: [
        ApolloServerPluginCacheControl({
          defaultMaxAge: +process.env.REDIS_DEFAULT_TTL,
        }),
        responseCachePlugin(),
      ],
      typePaths: ['dist/app/catalog.graphql'],
      context: ({ req }) => ({ req }),
      formatError,
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
