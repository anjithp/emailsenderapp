import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

//bootstrap the application
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(
    '/emails',
    bodyParser.json({ limit: '10mb', type: 'application/json' }),
  );

  const config = new DocumentBuilder()
    .setTitle('EmailSender')
    .setDescription('Email sender REST API')
    .setVersion('1.0.0')
    .addTag('emails')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService: ConfigService = app.get(ConfigService);
  await app.listen(configService.get('PORT') || 3000);
}

bootstrap();
