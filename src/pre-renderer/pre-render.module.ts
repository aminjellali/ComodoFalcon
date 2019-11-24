import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PreRenderController } from './pre-render.controller';
import { RessourceRequestsHandlerService } from './pre-renderer-services/ressource-requests-handler/ressource-requests-handler.service';
import { PreRenderingEngineService } from './pre-renderer-services/pre-rendering-engine/pre-rendering-engine.service';
import { PageSchema } from './schemas/page.schema';
import { PersistanceLayerService } from './pre-renderer-services/persistance-layer/persistance-layer.service';
import { OptimizerService } from './pre-renderer-services/optimizer/optimizer.service';
import { PreRendererConfigModule } from 'src/config/pre-renderer-config.module';
import { LoggerModule } from 'src/logger/logger.module';
/**
 * - Manage the pre-rendering service and their external dependencies.
 *
 * @export
 * @class PreRenderModule
 */
@Module({
  imports: [MongooseModule.forFeature([{ name: 'PreRenderedPages', schema: PageSchema }]), PreRendererConfigModule, LoggerModule],
  controllers: [
    PreRenderController],
  providers: [RessourceRequestsHandlerService, PreRenderingEngineService, PersistanceLayerService, OptimizerService],
})
export class PreRenderModule { }
