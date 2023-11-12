import { NestFactory } from '@nestjs/core';
import { CatalogModule } from './catalog.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(CatalogModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 36000 },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.listen(3001);
}
bootstrap();
