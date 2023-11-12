import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { options } from 'src/utils/database/ormconfig';
import { User } from 'src/utils/entities';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { config } from 'dotenv';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { GraphQLModule } from '@nestjs/graphql/dist';
import { AccessGuard, RolesGuard } from 'src/utils/guards';
import {
  ApolloFederationDriverConfig,
  ApolloFederationDriver,
} from '@nestjs/apollo';
import { LocalStrategy } from './strategies/local.strategy';
import { AccessStrategy } from 'src/utils/strategies/access.strategy';

config();

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
      formatError: (error) => {
        const originalError = error.extensions?.originalError as any;

        if (!originalError) {
          return {
            message: error.message,
            code: error.extensions?.code,
          };
        }
        return {
          message: originalError.message,
          code: error.extensions?.code,
        };
      },
      context: ({ req, res }) => ({ req, res }),
    }),
    TypeOrmModule.forRoot(options),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_REFRESH_KEY,
      signOptions: { expiresIn: process.env.REFRESH_EXPIRE_TIME },
    }),
    PassportModule,
  ],
  providers: [
    AuthService,
    AuthResolver,
    RefreshStrategy,
    LocalStrategy,
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
export class AuthModule {}
