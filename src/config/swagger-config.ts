import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
/**
 * - Since this Restful API comes with swagger implementation (or at least supposed to be ;p)
 * this default function is used to configure it and add some words to it.
 * - To consult the swagger documentation check out the ```/api``` endpoint.
 *
 * @export
 * @param {*} app
 */
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
