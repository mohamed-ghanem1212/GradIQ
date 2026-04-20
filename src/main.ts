import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import 'dotenv/config';
import { HttpExceptionFilter } from './common/filters/http-exception';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix('api/v1');
  const config = new DocumentBuilder()
    .setTitle('GradIQ API')
    .setDescription(
      `GradIQ is a platform that helps fresh graduates evaluate and enhance their CVs 
    to increase their chances of getting hired. 
    
    This API provides endpoints for:
    - CV upload and analysis
    - Scoring and feedback generation
    - Job market matching
    - User profile management
    
    All protected endpoints require a Bearer JWT token.`,
    )
    .setVersion('1.0')
    .addTag('Users')

    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
