import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/utils/entities';
import { options } from 'src/utils/database/ormconfig';
import { GraphQLModule } from '@nestjs/graphql/dist';
import {
  ApolloFederationDriverConfig,
  ApolloFederationDriver,
} from '@nestjs/apollo';
import { CatalogResolver } from './catalog.resolver';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer, AccessStrategy } from 'src/utils/strategies';
import { formatError } from 'src/utils/helpers/formatError';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import responseCachePlugin from '@apollo/server-plugin-response-cache';
import { ConfigModule, ConfigService } from '@nestjs/config/dist';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        plugins: [
          ApolloServerPluginCacheControl({
            defaultMaxAge: configService.get<number>('REDIS_DEFAULT_TTL'),
          }),
          responseCachePlugin(),
        ],
        typePaths: ['dist/app/catalog.graphql'],
        context: ({ req }: { req: any }) => ({ req }),
        formatError,
      }),
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
