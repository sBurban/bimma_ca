import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { TransformInterceptor } from './common/interceptors/TransformResponse.interceptor';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new TransformInterceptor()); // Formats "Success" responses

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips out Args/Params not stated in DTOs on controllers
      forbidNonWhitelisted: true, // Changes Whitelist to Throw error when any unexpected Args/Params is received
    }),
  );

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') || 3001;

  // Swagger for generating automatic REST-API documentation and playground
  const swaggerConfig = new DocumentBuilder()
    .setTitle('BIMM-APP Backend')
    .setDescription('Code Assessment API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}
bootstrap().then(() =>
  console.log(
    `Server running on http://localhost:${process.env.PORT}/api, ENV: ${process.env.NODE_ENV}`,
  ),
);
