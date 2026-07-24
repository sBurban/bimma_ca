import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import { TransformInterceptor } from './common/interceptors/TransformResponse.interceptor';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new TransformInterceptor()); // Formats "Success" responses

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strips out Args/Params not stated in DTOs on controllers
    forbidNonWhitelisted: true, // Changes Whitelist to Throw error when any unexpected Args/Params is received
  }));

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     transform: true, // Transform JS objects to expected DTO format on controllers
  //     whitelist: true, // Strips out Args/Params not stated in DTOs on controllers
  //     forbidUnknownValues: false, // Prevents inmediately failing "Unknown" objects
  //     stopAtFirstError: true,
  //   }),
  // );


  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') || 3001;

  await app.listen(port);
}
bootstrap().then(() =>
  console.log(
    `Server running on http://localhost:${process.env.PORT}/api, ENV: ${process.env.NODE_ENV}`,
  ),
);
