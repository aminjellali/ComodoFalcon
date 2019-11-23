import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from 'src/config/config-service/config-service.service';
import { LoggerService } from 'src/logger/logger.services/logger.service';

@Injectable()
export class OptimizerService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.ressourcesToDisable = this.configService
      .get('RESSOURCES_TO_DISABLE')
      .split(',');
    logger.info(
      `Parsed the following ressources to disable [${this.ressourcesToDisable}]`,
    );
  }
  readonly ressourcesToDisable: string[];
  async disableRessources(browserTab) {
    // enable request interception in chrome tab
    await browserTab.setRequestInterception(true);
    // abort in case the requested ressource type will slow down the process.
    browserTab.on('request', req => {
      if (this.ressourcesToDisable.includes(req.resourceType())) {
        this.logger.info(`aborting: ${req.url()}`);
        req.abort();
      } else if (req.resourceType()) {
        req.continue();
      }
    });
  }
}
