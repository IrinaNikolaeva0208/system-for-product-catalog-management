import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const authApp = await NestFactory.create(AuthModule);
  authApp.useGlobalPipes(new ValidationPipe());
  authApp.use(cookieParser());
  authApp.listen(3002);
}
bootstrap();
