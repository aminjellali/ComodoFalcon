import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { LoggerService } from 'src/logger/logger.services/logger.service';
/**
 *  - This stateful service will parse the config file and load all the configuration
 * variables we have specified.
 *  - There will be a single instance injectable in any service.
 *  - In case an other module uses it must import this module.
 *  - The extracted variables are neither typed nor validated, thus this process has to be implemented
 * in case the required variable is not of type string.
 * @export
 * @class ConfigService
 */
@Injectable()
export class ConfigService {
  private readonly envConfig: Record<string, string>;
  constructor(configFilePath: string, private readonly logger: LoggerService) {
    this.envConfig = dotenv.parse(fs.readFileSync(configFilePath));
    this.logger.info(`Launching pre-renderer using ${configFilePath} config file.`);
  }
  /**
   * Once this service is injected you 
   *
   * @param {string} key -  The key of the variable you want to extract
   * @returns {string} - The value of the provided key if existing.
   * @memberof ConfigService
   */
  get(key: string): string {
    return this.envConfig[key];
  }
}
