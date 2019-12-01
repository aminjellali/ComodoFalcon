import { Injectable, Logger } from '@nestjs/common';
import * as puppetter from 'puppeteer';
import { PreRenderedPageModel } from '../../models/preRenderedPageModel';
import { PersistanceLayerService } from '../persistance-layer/persistance-layer.service';

import { OptimizerService } from '../optimizer/optimizer.service';
import { ConfigService } from 'src/config/config-service/config-service.service';
import { LoggerService } from 'src/logger/logger.services/logger.service';
import { PreRenderingOperationType } from 'src/pre-renderer/models/preRenderingReport';
import { PreRendererResponseObject } from 'src/pre-renderer/models/preRendererResponseObject';

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
  /**
   * - value extracted from the ENABLE_OPTIMIZATION .conf file var.
   *
   * @type {boolean}
   * @memberof PreRenderingEngineService
   */
  readonly optimizerEnabled: boolean;
  /**
   * - value extracted from the IDENTIFY_AS_BOT .conf file var.
   *
   * @type {boolean}
   * @memberof PreRenderingEngineService
   */
  readonly identifyAsBot: boolean;
  /**
   * - value extracted from the LAUNCH_HEADLESS_BROWSER .conf file var.
   *
   * @type {boolean}
   * @memberof PreRenderingEngineService
   */
  readonly launchHeadlessBrowser: boolean;
  /**
   * - value extracted from the USER_AGENT_AS_BOT .conf file var.
   *
   * @type {string}
   * @memberof PreRenderingEngineService
   */
  readonly botUserAgent: string;
  /**
   * - value extracted from the WAIT_FOR_STARTERS .conf file var.
   *
   * @type {string[]}
   * @memberof PreRenderingEngineService
   */
  readonly waitForStarters: string[];
  /**
   * - Get a page by Url
   *
   * @param {string} url
   * @returns {Promise<PreRenderedPageModel>}
   * @memberof PreRenderingEngineService
   */
  async getPreRenderedPageByUrl(url: string, projection: any): Promise<PreRenderedPageModel> {
    return await this.pagePersistanceService.getPageByUrlAndProject(url, projection);
  }
  /**
   * - Pre-render a web page by its url than persist it in the database.
   * - Rejects errors of it's sub functions.
   *
   * @param {string} url
   * @param {string} [elementToWaitFor]
   * @returns {Promise<PreRendererResponseObject>}
   * @memberof PreRenderingEngineService
   */
  async preRenderAndPersistPage(
    url: string,
    elementToWaitFor?: string,
  ): Promise<PreRendererResponseObject> {
    return new Promise(async (resolve, reject) => {
      try {
        let waitFor;
        if (this.stirngIsValid(elementToWaitFor)) {
          waitFor = this.resolveWaitFor(elementToWaitFor);
        } else {
          this.logger.warn(
            `The element to wait for is not defined.`,
          );
        }
        const tabContent = await this.preRenderPage(url, waitFor);
        const preRenderedPageData: PreRenderedPageModel = {
          content: tabContent[0],
          lastPreRenderingDate: new Date().getTime(),
          pageUrl: url,
        };
        const persistedPreRenderedPageData = await this.handlePagePersistance(
          preRenderedPageData,
        );
        resolve({
          preRenderingReport: {
            pageUrl: url,
            timePassedPreRendering: tabContent[1],
            operationType: persistedPreRenderedPageData[1],
          },
          pageModel: persistedPreRenderedPageData[0],
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  /**
   * - Retreives all pre-rendered pages.
   *
   * @returns {Promise<PreRenderedPageModel[]>}
   * @memberof PreRenderingEngineService
   */
  async getAllPreRenderedPages(): Promise<PreRenderedPageModel[]> {
    return await this.pagePersistanceService.getAllPreRenderedPages();
  }
  /**
   * - Delete a page by it's Url.
   *
   * @param {string} url
   * @returns {Promise<PreRenderedPageModel>}
   * @memberof PreRenderingEngineService
   */
  async deletePersistedPageByUrl(url: string): Promise<PreRenderedPageModel> {
    return await this.pagePersistanceService.deletePageByUrl(url);
  }
  /**
   * - This function will decide to either update or create pre-renderd page.
   *
   * @private
   * @param {PreRenderedPageModel} page
   * @returns {Promise<PreRenderedPageModel>}
   * @memberof PreRenderingEngineService
   */
  private async handlePagePersistance(
    page: PreRenderedPageModel,
  ): Promise<[PreRenderedPageModel, PreRenderingOperationType]> {
    const persistedPage = await this.pageIfPersisted(page.pageUrl);
    if (persistedPage) {
      this.logger.info('Found previous, updating ...');
      return [await this.pagePersistanceService.updatePage(
        persistedPage.id,
        page,
      ), PreRenderingOperationType.UPDATE];
    }
    this.logger.info('No previous page found, adding new ...');
    return [await this.pagePersistanceService.writePage(page), PreRenderingOperationType.CREATE];
  }
  /**
   * - returns a page if it exists with minimimal data.
   *
   * @private
   * @param {string} url
   * @returns {Promise<PreRenderedPageModel>}
   * @memberof PreRenderingEngineService
   */
  private async pageIfPersisted(url: string): Promise<PreRenderedPageModel> {
    return await this.pagePersistanceService.getPageByUrlAndProject(url);
  }
  /**
   * - Responsible for pre-renderinga page.
   * - Logs the time taken for a page to pre-render.
   *
   * @private
   * @param {*} url
   * @param {string} waitFor
   * @returns {Promise<string>}
   * @memberof PreRenderingEngineService
   */
  private async preRenderPage(url, waitFor: string): Promise<[string, string]> {
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
        const response = await browserTab.goto(url);
        console.log(typeof response.status());
        if (waitFor) {
          await browserTab.waitFor(waitFor);
        }
        const tabContent = await browserTab.content();
        await browserTab.close();
        await browser.close();
        this.logger.info(`Took ${process.hrtime(hrStart)} to render ${url}`);
        resolve([tabContent, process.hrtime(hrStart).toString()]);
      } catch (err) {
        this.logger.error(err, err.trace);
        await browserTab.close();
        await browser.close();
        reject(err);
      }
    });
  }
  /**
   * - Will validate and resolve if provied the element to wait for.
   * - Throws error if not valid.
   *
   * @private
   * @param {string} waitFor
   * @returns {string}
   * @memberof PreRenderingEngineService
   */
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
      `Could not resolve element to wait for, type of the element to wait for <${waitFor}> it has
       to start with one of [${this.waitForStarters}] and must have a length > 1. in case such element
       does not exist there wiill be a  time out exception.`,
    );
  }
  /**
   * - Returns a string if it is valid
   *
   * @private
   * @param {string} stringValue
   * @returns {string}
   * @memberof PreRenderingEngineService
   */
  private stirngIsValid(stringValue: string): string {
    if (stringValue && stringValue.length !== 0) {
      return stringValue.toString();
    } else {
      return undefined;
    }
  }
}
