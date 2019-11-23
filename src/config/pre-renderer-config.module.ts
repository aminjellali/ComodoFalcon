
import { Module } from '@nestjs/common';
import { ConfigService } from './config-service/config-service.service';

@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(`${process.env.NODE_ENV || 'development'}.env`),
    },
  ],
  exports: [ConfigService],
})
export class PreRendererConfigModule {}