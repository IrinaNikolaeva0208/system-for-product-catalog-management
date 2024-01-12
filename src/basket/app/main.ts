import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { BasketModule } from './basket.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { WinstonModule } from 'nest-winston';
import { ApplicationLogger } from 'src/utils/logger';

async function bootstrap() {
  const app = await NestFactory.create(BasketModule, {
    logger: WinstonModule.createLogger({ instance: ApplicationLogger }),
  });
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('BASKET_PORT');
  const SECRET = configService.get<string>('SESSION_SECRET');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    session({
      secret: SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 36000000 },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.listen(PORT);
}
bootstrap();
