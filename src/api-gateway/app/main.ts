import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ValidationPipe } from '@nestjs/common/pipes';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  try {
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
  } catch (err) {
    await app.close();
    bootstrap();
  }
}

bootstrap();
