import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import { LoggerService } from './logger/logger.services/logger.service';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Minotore Pre-Renderer')
    .setDescription(
      'An API built on top on puppeteer and nest js to solve pre-render web pages',
    )
    .setVersion('1.0')
    .addTag('SEO')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  app.useLogger(app.get(LoggerService));
  SwaggerModule.setup('api', app, document);
  app.use(compression());
  await app.listen(3000);
}
bootstrap();
