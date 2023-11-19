import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import { WinstonModule } from 'nest-winston';
import { ApplicationLogger } from 'src/utils/logger';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule, {
    logger: WinstonModule.createLogger({ instance: ApplicationLogger }),
  });
  try {
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
  } catch (err) {
    console.log(err);
    await app.close();
    bootstrap();
  }
}

bootstrap();
