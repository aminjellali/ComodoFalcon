import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PreRenderController } from './pre-render/pre-render.controller';
import { PrerenderdAssetsController } from './prerenderd-assets/prerenderd-assets.controller';
import { RessourceRequestsHandlerService } from './pre-render/ressource-requests-handler/ressource-requests-handler.service';
import { PreRenderModule } from './pre-render/pre-render.module';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [PreRenderModule],
  controllers: [AppController, PreRenderController, PrerenderdAssetsController],
  providers: [AppService, RessourceRequestsHandlerService],
})
export class AppModule { }
