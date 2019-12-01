import { Module } from '@nestjs/common';
import { RequestsHandlingService } from './rmq.services/requests-handling/requests-handling.service';
import { RmqController } from './rmq/rmq.controller';
import { LoggerModule } from 'src/logger/logger.module';
import { PreRenderModule } from 'src/pre-renderer/pre-render.module';
import { PreRendererConfigModule } from 'src/config/pre-renderer-config.module';

@Module({
  imports: [
    PreRenderModule,
    LoggerModule, PreRendererConfigModule, LoggerModule,
  ],
  providers: [RequestsHandlingService],
  controllers: [RmqController],
})
export class RmqModule { }
