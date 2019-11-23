import { Injectable } from '@nestjs/common';
import { ElementToWaitForType } from '../pre-render-controller-DTOs/preRenderRequestDTO';
import * as puppetter from 'puppeteer';
import { PreRenderedPageModel } from '../pre-render-documents/preRenderedPageModel';
@Injectable()
export class PreRenderingEngineService {
    async preRenderPage(url: string, elementToWaitFor: string, elementToWaitForType: ElementToWaitForType): Promise<any> {
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
                    content : tabContent,
                    lastPreRenderingDate : new Date().getTime(),
                    pageUrl: url,
                }
                resolve(tabContent);
            } catch (error) {
                reject(error);
            }
        });
    }
}
