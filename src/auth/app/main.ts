import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import { WinstonModule } from 'nest-winston';
import { ApplicationLogger } from 'src/utils/logger';
import { env } from 'src/utils/env';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule, {
    logger: WinstonModule.createLogger({ instance: ApplicationLogger }),
  });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    session({
      secret: env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 36000000 },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cookieParser());
  app.listen(env.AUTH_PORT as string);
}
bootstrap();
