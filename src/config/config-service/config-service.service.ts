import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { LoggerService } from 'src/logger/logger.services/logger.service';
@Injectable()
export class ConfigService {
  private readonly envConfig: Record<string, string>;
  constructor(configFilePath: string, private readonly logger: LoggerService) {
    this.envConfig = dotenv.parse(fs.readFileSync(configFilePath));
    this.logger.info(`Launching pre-renderer using ${configFilePath} config file.`);
  }
  get(key: string): string {
    return this.envConfig[key];
  }
}
