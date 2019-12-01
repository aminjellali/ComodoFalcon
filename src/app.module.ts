import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrerenderdAssetsController } from './prerenderd-assets/prerenderd-assets.controller';
import { RessourceRequestsHandlerService } from './pre-renderer/pre-renderer-services/ressource-requests-handler/ressource-requests-handler.service';
import { PreRenderModule } from './pre-renderer/pre-render.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PreRendererConfigModule } from './config/pre-renderer-config.module';
import { ConfigService } from './config/config-service/config-service.service';
import { LoggerModule } from './logger/logger.module';
import { RmqModule } from './rmq-handler/rmq.module';

@Module({
  imports: [
    PreRenderModule,
    PreRendererConfigModule,
    MongooseModule.forRootAsync({
      imports: [PreRendererConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }),
      inject: [ConfigService],
    }),
    LoggerModule,
    RmqModule,
  ],
  controllers: [AppController, PrerenderdAssetsController],
  providers: [AppService, RessourceRequestsHandlerService],
})
export class AppModule {}
