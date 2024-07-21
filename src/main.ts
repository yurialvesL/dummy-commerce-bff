/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().addBearerAuth({
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  }, 'Bearer')
    .setTitle('dummy commerce API')
    .setDescription('This Api has ben created for data manipulation to ecommerce')
    .setVersion('1.0')

    .build();

    app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
  });

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/swagger', app, document);

  await app.listen(3000);
}
bootstrap();
