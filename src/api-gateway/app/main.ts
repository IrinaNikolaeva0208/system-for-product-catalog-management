import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import { WinstonModule } from 'nest-winston';
import { ApplicationLogger as logger } from 'src/utils/logger';
import { env } from 'src/utils/env';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule, {
    logger: WinstonModule.createLogger({ instance: logger }),
  });
  try {
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(env.GATEWAY_PORT as string);
  } catch (err) {
    await app.close();
    logger.error('Unable to connect to microservices. Retrying...');
    setTimeout(bootstrap, 5000);
  }
}

bootstrap();
