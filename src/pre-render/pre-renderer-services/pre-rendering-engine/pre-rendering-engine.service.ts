import { Injectable } from '@nestjs/common';
import { ElementToWaitForType } from '../../pre-render-controller-DTOs/preRenderRequestDTO';
import * as puppetter from 'puppeteer';
import { PreRenderedPageModel } from '../../models/preRenderedPageModel';
import { PersistanceLayerService } from '../persistance-layer/persistance-layer.service';
@Injectable()
export class PreRenderingEngineService {
    constructor(private readonly pagePersistanceService: PersistanceLayerService) { }
    async preRenderPage(url: string, elementToWaitFor?: string, elementToWaitForType?: ElementToWaitForType): Promise<PreRenderedPageModel> {
        const browser = await puppetter.launch({ headless: true });
        return new Promise(async (resolve, reject) => {
            try {
                // launch a new tab in the browser.
                let tab = await browser.newPage();
                // await tab.setBypassCSP(true);
                // tab.setUserAgent("bot");
                // blockers.disableRessources(tab, ressourcesToDisable);
                await tab.goto(url);
                // await tab.waitFor("#overview");
                const tabContent = await tab.content();
                // browser.close;
                await tab.close();
                await browser.close();
                const preRenderedPageData: PreRenderedPageModel = {
                    content: tabContent,
                    lastPreRenderingDate: new Date().getTime(),
                    pageUrl: url,
                }
                const persistedPreRenderedPageData = await this.pagePersistanceService.writePage(preRenderedPageData);
                resolve(persistedPreRenderedPageData);
            } catch (error) {
                reject(error);
            }
        });
    }
    async getAllPreRenderedPages(): Promise<PreRenderedPageModel[]> {
        return await this.pagePersistanceService.getAllPreRenderedPages();
    }

}
