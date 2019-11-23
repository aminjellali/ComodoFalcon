
import { Module } from '@nestjs/common';
import { ConfigService } from './config-service/config-service.service';
import { LoggerService } from 'src/logger/logger.services/logger.service';

@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(`${process.env.NODE_ENV || 'development'}.conf`, new LoggerService()),
    },
  ],
  exports: [ConfigService],
})
export class PreRendererConfigModule {}
