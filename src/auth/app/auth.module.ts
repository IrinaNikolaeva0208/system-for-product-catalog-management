import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { options } from 'src/utils/database/ormconfig';
import { User } from 'src/utils/entities';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GraphQLModule } from '@nestjs/graphql/dist';
import {
  ApolloFederationDriverConfig,
  ApolloFederationDriver,
} from '@nestjs/apollo';
import { LocalStrategy, RefreshStrategy } from './strategies';
import { AccessStrategy, SessionSerializer } from 'src/utils/strategies';
import { formatError } from 'src/utils/helpers/formatError';
import { env } from 'src/utils/env';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
      formatError,
      context: ({ req, res }: { res: any; req: any }) => ({ req, res }),
    }),
    TypeOrmModule.forRoot(options as TypeOrmModuleOptions),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: env.JWT_SECRET_REFRESH_KEY,
      signOptions: { expiresIn: env.REFRESH_EXPIRE_TIME },
    }),
    PassportModule,
  ],
  providers: [
    AuthService,
    AuthResolver,
    RefreshStrategy,
    LocalStrategy,
    AccessStrategy,
    SessionSerializer,
  ],
})
export class AuthModule {}
