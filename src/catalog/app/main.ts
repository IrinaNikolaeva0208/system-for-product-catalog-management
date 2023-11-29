import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config/dist';
import { CatalogModule } from './catalog.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import * as session from 'express-session';
import * as passport from 'passport';
import { WinstonModule } from 'nest-winston';
import { ApplicationLogger } from 'src/utils/logger';
import { MicroserviceModule } from './microservice/microservice.module';

async function bootstrap() {
  const app = await NestFactory.create(CatalogModule, {
    logger: WinstonModule.createLogger({ instance: ApplicationLogger }),
  });
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('CATALOG_PORT');
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
