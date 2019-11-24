import { Injectable, Logger } from '@nestjs/common';
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
    this.waitForStarters = configService.get('WAIT_FOR_STARTERS').split(',');
    this.botUserAgent = configService.get('USER_AGENT_AS_BOT');
    logger.info(`Rendering optimizer enabled ${this.optimizerEnabled}`);
  }
  readonly optimizerEnabled: boolean;
  readonly identifyAsBot: boolean;
  readonly launchHeadlessBrowser: boolean;
  readonly botUserAgent: string;
  readonly waitForStarters: string[];
  async getPreRenderedPageByUrl(url: string): Promise<PreRenderedPageModel> {
    return await this.pagePersistanceService.getPageByUrlAndProject(url);
  }
  async preRenderAndPersistPage(
    url: string,
    elementToWaitFor?: string,
  ): Promise<PreRenderedPageModel> {
    return new Promise(async (resolve, reject) => {
      try {
        let waitFor;
        if (this.stirngIsValid(elementToWaitFor)) {
          waitFor = this.resolveWaitFor(elementToWaitFor);
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
        const persistedPreRenderedPageData = await this.handlePagePersistance(
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
  async deletePersistedPageByUrl(url: string): Promise<PreRenderedPageModel> {
    return await this.pagePersistanceService.deletePageByUrl(url);
  }
  private async handlePagePersistance(
    page: PreRenderedPageModel,
  ): Promise<PreRenderedPageModel> {
    const persistedPage = await this.pageIfPersisted(page.pageUrl);
    if (persistedPage) {
      this.logger.info('Found previous, updating ...');
      return await this.pagePersistanceService.updatePage(
        persistedPage.id,
        page,
      );
    }
    this.logger.info('No previous page found, adding new ...');
    return await this.pagePersistanceService.writePage(page);
  }

  private async pageIfPersisted(url: string): Promise<PreRenderedPageModel> {
    return await this.pagePersistanceService.getPageByUrlAndProject(url);
  }
  private async preRenderPage(url, waitFor: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const browser = await puppetter.launch({
        headless: this.launchHeadlessBrowser,
      });
      // launch a new tab in the browser.
      const browserTab = await browser.newPage();
      const hrStart = process.hrtime();
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
        this.logger.info(`Took ${process.hrtime(hrStart)} to render ${url}`);
        resolve(tabContent);
      } catch (err) {
        this.logger.error(err, err.trace);
        await browserTab.close();
        await browser.close();
        reject(err);
      }
    });
  }
  private resolveWaitFor(waitFor: string): string {
    for (
      let waitForStarterIndex = 0;
      waitForStarterIndex <= this.waitForStarters.length;
      waitForStarterIndex++
    ) {
      if (
        waitFor.startsWith(this.waitForStarters[waitForStarterIndex]) &&
        waitFor.length > 1
      ) {
        return waitFor;
      }
    }
    throw new Error(
      `Could not resolve element to wait for, type of the element to wait for <${waitFor}> it has to start with one of [${this.waitForStarters}] and must have a length > 1. in case such element does not exist there wiill be a  time out exception.`,
    );
  }
  private stirngIsValid(stringValue: string): string {
    if (stringValue && stringValue.length !== 0) {
      return stringValue.toString();
    } else {
      return undefined;
    }
  }
}
