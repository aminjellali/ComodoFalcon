import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import { PreRenderController } from './pre-render.controller';
import { RessourceRequestsHandlerService } from './ressource-requests-handler/ressource-requests-handler.service';
import { PreRenderingEngineService } from './pre-rendering-engine/pre-rendering-engine.service';
import { PageSchema } from './schemas/page.schema';
import { PersistanceLayerService } from './persistance-layer/persistance-layer.service';

@Module({
  imports: [MongooseModule.forFeature([{name: 'PreRenderedPages', schema: PageSchema}])],
  controllers: [
    PreRenderController],
  providers: [RessourceRequestsHandlerService, PreRenderingEngineService, PersistanceLayerService],
})
export class PreRenderModule { }
