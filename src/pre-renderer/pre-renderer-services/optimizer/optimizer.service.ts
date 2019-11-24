import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from 'src/config/config-service/config-service.service';
import { LoggerService } from 'src/logger/logger.services/logger.service';
/**
 *  - The optimizer service is used to reduce the page rendering time in the browser.
 *
 * @export
 * @class OptimizerService
 */
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
  /**
   * - When called and given a browserTab instance this function will force the browser
   * to abort the requests that are not necessary and that will slow down rendering time
   * like style sheets, images ...
   * - You can choose what ressource types to disable thanks to the ```RESSOURCES_TO_DISABLE```
   * string that could be found in the process environment ```.conf``` file.
   *
   * @param {*} browserTab
   * @memberof OptimizerService
   */
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
