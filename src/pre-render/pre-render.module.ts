import { Module } from '@nestjs/common';
import { PreRenderController } from './pre-render.controller';
import { RessourceRequestsHandlerService } from './ressource-requests-handler/ressource-requests-handler.service';
import { PreRenderingEngineService } from './pre-rendering-engine/pre-rendering-engine.service';

@Module({
  imports: [PreRenderModule],
  controllers: [
    PreRenderController],
  providers: [ RessourceRequestsHandlerService, PreRenderingEngineService],
})
export class PreRenderModule {}
