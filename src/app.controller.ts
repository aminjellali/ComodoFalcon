import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import * as fs from 'fs';
import { LoggerService } from './logger/logger.services/logger.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  getHello(): string {
    Logger.warn('Iam ooooon !!');
    return 'Hello World!';
  }
}
