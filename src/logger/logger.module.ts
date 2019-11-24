import { Module, Logger } from '@nestjs/common';
import { LoggerService } from './logger.services/logger.service';
/**
 * - This module is mainly used to create a single instance logging mechansim
 * and could support reporting in later version if there will be any.
 *
 * @export
 * @class LoggerModule
 */
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule { }
