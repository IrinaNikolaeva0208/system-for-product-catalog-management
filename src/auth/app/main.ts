import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import { config } from 'dotenv';
import { WinstonModule } from 'nest-winston';
import { ApplicationLogger } from 'src/utils/logger';

config();

async function bootstrap() {
  const app = await NestFactory.create(AuthModule, {
    logger: WinstonModule.createLogger({ instance: ApplicationLogger }),
  });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 36000000 },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cookieParser());
  app.listen(3002);
}
bootstrap();
