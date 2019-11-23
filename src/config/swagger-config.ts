import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default function swaggerConfigurer(app) {
  const options = new DocumentBuilder()
    .setTitle('Minotore Pre-Renderer')
    .setDescription(
      'An API built on top on puppeteer and nest js to solve pre-render web pages',
    )
    .setVersion('1.0')
    .addTag('SEO')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}
