import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationTypes } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
