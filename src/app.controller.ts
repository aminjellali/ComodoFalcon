import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import * as fs from 'fs';
import { LoggerService } from './logger/logger.services/logger.service';
/**
 * @ignore
 *
 * @export
 * @class AppController
 */
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: LoggerService,
  ) { }
}
