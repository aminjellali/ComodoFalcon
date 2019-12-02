import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { LoggerService } from './logger/logger.services/logger.service';
import swaggerConfigurer from './config/swagger-config';
import { ConfigService } from './config/config-service/config-service.service';
import { Transport } from '@nestjs/common/enums/transport.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Combine http app with nest microservices
  const  microservice = app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://localhost:5672`],
      queue: 'comodoFalcon_queue',
      queueOptions : {durable: false},
    }
  });
  // Configure swagger.
  swaggerConfigurer(app);
  // Override the default logger.
  app.useLogger(app.get(LoggerService));
  // Enable data compression.
  app.use(compression());
  // retreive port
  const serverPort = app.get(ConfigService).get('SERVER_PORT');
  // start a hybrid app.
  await app.startAllMicroservicesAsync();
  await app.listen(serverPort);
  app.get(LoggerService).info(`Listening on port ${serverPort}`);
  app.get(LoggerService).warn('Configurations retreived from the .conf file are not typed and might require further processsing');
}
bootstrap();
