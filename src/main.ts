import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  HttpStatus,
  ValidationError,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // versioning
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  //validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException({
          status: 'FAILED',
          code: HttpStatus.BAD_REQUEST,
          message: null,
          payload: null,
          errors: validationErrors.map((error) => ({
            title: error.property,
            description: Object.values(error.constraints).join(', '),
          })),
        });
      },
    }),
  );

  await app.listen(3333);
}
bootstrap();
