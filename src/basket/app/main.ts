import { NestFactory } from '@nestjs/core';
import { BasketModule } from './basket.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { WinstonModule } from 'nest-winston';
import { ApplicationLogger } from 'src/utils/logger';
import { env } from 'src/utils/env';

async function bootstrap() {
  const app = await NestFactory.create(BasketModule, {
    logger: WinstonModule.createLogger({ instance: ApplicationLogger }),
  });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    session({
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 36000000 },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.listen(env.BASKET_PORT);
}
bootstrap();
