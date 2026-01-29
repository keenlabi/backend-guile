import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './shared/infrastructure/filters/global-exception.filter';
import { ResponseInterceptor } from './shared/infrastructure/interceptors/response.interceptor';
import cookieParser from 'cookie-parser';
import { validationExceptionFactory } from './shared/errors/validation.exception-factory';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: [
      'http://lumexvip.com',
      'https://lumexvip.com',
      'http://www.lumexvip.com',
      'https://www.lumexvip.com',
      'http://localhost:5173', // Keep for local dev
      'http://localhost:3000'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // <--- CRITICAL for Auth to work
  });
  // 	app.enableCors({
  // 	// origin: "*",
  // 	// credentials: true,
  // });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', 
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
