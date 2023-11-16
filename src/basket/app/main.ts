import { NestFactory } from '@nestjs/core';
import { BasketModule } from './basket.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';

import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create(BasketModule);
  app.enableCors();
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
  app.listen(3004);
}
bootstrap();
