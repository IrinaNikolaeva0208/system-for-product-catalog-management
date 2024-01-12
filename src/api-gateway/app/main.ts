import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import { WinstonModule } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { ApplicationLogger as logger } from 'src/utils/logger';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule, {
    logger: WinstonModule.createLogger({ instance: logger }),
  });
  try {
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());
    const configService = app.get(ConfigService);
    const PORT = configService.get<number>('GATEWAY_PORT');
    await app.listen(PORT);
  } catch (err) {
    await app.close();
    logger.error('Unable to connect to microservices. Retrying...');
    setTimeout(bootstrap, 5000);
  }
}

bootstrap();
