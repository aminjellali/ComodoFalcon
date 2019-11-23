import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrerenderdAssetsController } from './prerenderd-assets/prerenderd-assets.controller';
import { RessourceRequestsHandlerService } from './pre-render/pre-renderer-services/ressource-requests-handler/ressource-requests-handler.service';
import { PreRenderModule } from './pre-render/pre-render.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PreRendererConfigModule } from './config/pre-renderer-config.module';
import { ConfigService } from './config/config-service/config-service.service';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    PreRenderModule,
    PreRendererConfigModule,
    // This line is used to inject the service and use it to dynamically change the url of the data base
    MongooseModule.forRootAsync({
      imports: [PreRendererConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    LoggerModule,
  ],
  controllers: [AppController, PrerenderdAssetsController],
  providers: [AppService, RessourceRequestsHandlerService],
})
export class AppModule {}
