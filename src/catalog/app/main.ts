import { NestFactory } from '@nestjs/core';
import { CatalogModule } from './catalog.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import * as session from 'express-session';
import * as passport from 'passport';

import { config } from 'dotenv';
import { MicroserviceModule } from './microservice.module';

config();

async function bootstrap() {
  const app = await NestFactory.create(CatalogModule);
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
  app.listen(3001);

  const microservice = await NestFactory.createMicroservice(
    MicroserviceModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['kafka:9092'],
        },
        consumer: {
          groupId: 'catalog-consumer',
        },
      },
    },
  );
  microservice.listen();
}
bootstrap();
