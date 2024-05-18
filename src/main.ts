import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './ErrorHandlers/errorHandlers';
import { HttpException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors();
    console.log(process.env);
    console.log(process.env.PORT);
    await app.listen(process.env.PORT || 8080);
  } catch (error) {
    throw new HttpException('unhandled exception', 500, error);
  }
}
bootstrap();
