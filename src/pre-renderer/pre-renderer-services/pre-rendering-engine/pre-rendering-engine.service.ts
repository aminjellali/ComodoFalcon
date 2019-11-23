import { Injectable, Logger } from '@nestjs/common';
import { ElementToWaitForType } from '../../pre-renderer-controller-DTOs/preRenderRequestDTO';
import * as puppetter from 'puppeteer';
import { PreRenderedPageModel } from '../../models/preRenderedPageModel';
import { PersistanceLayerService } from '../persistance-layer/persistance-layer.service';

import { OptimizerService } from '../optimizer/optimizer.service';
import { ConfigService } from 'src/config/config-service/config-service.service';
import { LoggerService } from 'src/logger/logger.services/logger.service';
@Injectable()
export class PreRenderingEngineService {
  constructor(
    private readonly pagePersistanceService: PersistanceLayerService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
    private readonly optimizerService: OptimizerService,
  ) {
    this.optimizerEnabled = JSON.parse(
      configService.get('ENABLE_OPTIMIZATION'),
    );
    this.identifyAsBot = JSON.parse(configService.get('IDENTIFY_AS_BOT'));
    this.launchHeadlessBrowser = JSON.parse(
      configService.get('LAUNCH_HEADLESS_BROWSER'),
    );
    this.botUserAgent = configService.get('USER_AGENT_AS_BOT');
    logger.info(`Rendering optimizer enabled ${this.optimizerEnabled}`);
  }
  readonly optimizerEnabled: boolean;
  readonly identifyAsBot: boolean;
  readonly launchHeadlessBrowser: boolean;
  readonly botUserAgent: string;

  async preRenderAndPersistPage(
    url: string,
    elementToWaitFor?: string,
    elementToWaitForType?: ElementToWaitForType,
  ): Promise<PreRenderedPageModel> {
    return new Promise(async (resolve, reject) => {
      try {
        let waitFor;
        if (this.stirngIsValid(elementToWaitFor) && elementToWaitForType) {
          waitFor = this.resolveWaitFor(elementToWaitFor, elementToWaitForType);
        } else {
          this.logger.warn(
            `The element to wait for or it's time are not defined.`,
          );
        }
        const tabContent = await this.preRenderPage(url, waitFor);
        const preRenderedPageData: PreRenderedPageModel = {
          content: tabContent,
          lastPreRenderingDate: new Date().getTime(),
          pageUrl: url,
        };
        const persistedPreRenderedPageData = await this.pagePersistanceService.writePage(
          preRenderedPageData,
        );
        resolve(persistedPreRenderedPageData);
      } catch (error) {
        reject(error);
      }
    });
  }
  async getAllPreRenderedPages(): Promise<PreRenderedPageModel[]> {
    return await this.pagePersistanceService.getAllPreRenderedPages();
  }

  private async preRenderPage(url, waitFor: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const browser = await puppetter.launch({
        headless: this.launchHeadlessBrowser,
      });
      // launch a new tab in the browser.
      const browserTab = await browser.newPage();
      try {
        if (this.identifyAsBot) {
          browserTab.setUserAgent(this.botUserAgent);
        }
        if (this.optimizerEnabled) {
          this.optimizerService.disableRessources(browserTab);
        }
        await browserTab.goto(url);
        if (waitFor) {
          await browserTab.waitFor(waitFor);
        }
        const tabContent = await browserTab.content();
        await browserTab.close();
        await browser.close();
        resolve(tabContent);
      } catch (err) {
        this.logger.error(err, err.trace);
        await browserTab.close();
        await browser.close();
        reject(err);
      }
    });
  }
  private resolveWaitFor(
    waitFor: string,
    waitForType: ElementToWaitForType,
  ): string {
    switch (waitForType) {
      case ElementToWaitForType.CSS_CLASS:
        return `.${waitFor}`;
      case ElementToWaitForType.ID:
        return `#${waitFor}`;
      default:
        throw new Error(
          `Could not resolve element to wait for, type of the element to wait for <${waitForType}>, element to wait for: <${waitFor}>`,
        );
    }
  }
  private stirngIsValid(stringValue: string) {
    return stringValue && stringValue.length !== 0;
  }
}
