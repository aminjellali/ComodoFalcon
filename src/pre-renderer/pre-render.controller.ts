import {
  Controller,
  Body,
  Post,
  HttpException,
  HttpStatus,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { PreRenderRequestDTO } from './pre-renderer-controller-DTOs/preRenderRequestDTO';
import { PreRenderingEngineService } from './pre-renderer-services/pre-rendering-engine/pre-rendering-engine.service';
import { PreRenderedPageModel } from './models/preRenderedPageModel';
import { PreRenderedPageDataDTO } from './pre-renderer-controller-DTOs/preRenderedPageDataDTO';
@Controller('pre-render')
export class PreRenderController {
  constructor(
    private readonly preRenderingEngineService: PreRenderingEngineService,
  ) { }
  /**
   * @Get ````get-all-pages```
   * - Gets All the pre-rendered pages form the database.
   * - Throws and 404 exceptionn in case nothing is found.
   *
   * @returns {Promise<PreRenderedPageDataDTO[]>}
   * @memberof PreRenderController
   */
  @Get('get-all-pages')
  async getPrenderedPagesByInput(): Promise<PreRenderedPageDataDTO[]> {
    const preRenderedPages = await this.preRenderingEngineService.getAllPreRenderedPages();
    try {
      return preRenderedPages.map(preRenderedPage => {
        return {
          lastPreRenderingDate: new Date(preRenderedPage.lastPreRenderingDate),
          pageUrl: preRenderedPage.pageUrl,
          content: preRenderedPage.content,
        };
      });
    } catch (error) {
      throw new HttpException(`No page to be found, this error occured while fetching content ${error}`, HttpStatus.NOT_FOUND);
    }
  }
  /**
   * @Post ````get-page-by-url```
   * - Gets a pre-rendered page by the provided url form the database.
   * - Throws and 404 exceptionn in case nothing is found.
   * - Body example { "url" : "http://www.egyBest.com"}
   *
   * @param {*} getPageUrl
   * @returns {Promise<PreRenderedPageDataDTO>}
   * @memberof PreRenderController
   */
  @Post('get-page-by-url')
  async getPrenderedPagesByUrl(
    @Body() getPageUrl,
  ): Promise<PreRenderedPageDataDTO> {
    const preRenderedPage = await this.preRenderingEngineService.getPreRenderedPageByUrl(
      getPageUrl.url, {pageUrl: 1, content: 1, lastPreRenderingDate: 1},
    );
    try {
      return {
        pageUrl: preRenderedPage.pageUrl,
        lastPreRenderingDate: new Date(preRenderedPage.lastPreRenderingDate),
        content: preRenderedPage.content,
      };
    } catch (error) {
      throw new HttpException(`No page to be found, this error occured while fetching content ${error}`, HttpStatus.NOT_FOUND);
    }
  }
  /**
   * @Post ````pre-render-page```
   * - Tries to pre-render a web page by it's URL (add to database or save if exists).
   * - Body example {"pageUrl": "http://uat-seeyond.minotore.com/fr/en/pro/products/3307","elementToWaitFor": "#overview"}
   * - Many issues could happen when using this endpoint like TimeOuts, UnresolvableLinks,elementToWaitForNotValid... thus
   * it simply throws a 500 Exception and the provied the underlting error.
   * - If the elementToWaitFor is not provided it the browser will render the first content it receives.
   * @param {PreRenderRequestDTO} preRenderPageDTO
   * @returns
   * @memberof PreRenderController
   */
  @Post('pre-render-page')
  preRenderWebPage(@Body() preRenderPageDTO: PreRenderRequestDTO) {
    return this.preRenderingEngineService
      .preRenderAndPersistPage(preRenderPageDTO.pageUrl, preRenderPageDTO.elementToWaitFor)
      .then(resolved => {
        return resolved;
      })
      .catch(error => {
        throw new HttpException(
          `This error occured while pre-rendering page ${error}.`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
  }
  /**
   * @Delete ````delete-pre-rendered-page-by-url```
   * - Deletes a pre-rendered web page by it's URL.
   * - Body example {"url": "http://uat-seeyond.minotore.com/fr/en/pro/products/3307"}
   * - Throws and 400 exceptionn in case page is not found.
   * 
   * @param {PreRenderRequestDTO} preRenderPageDTO
   * @returns
   * @memberof PreRenderController
   *
   * @param {*} pageToDeleteUrl
   * @returns
   * @memberof PreRenderController
   */
  @Delete('delete-pre-rendered-page-by-url')
  deletePreRenderedPageByUrl(@Body() pageToDeleteUrl) {
    return this.preRenderingEngineService.deletePersistedPageByUrl(pageToDeleteUrl.url).then(
      resolved => {
        return resolved;
      }
    ).catch(error => {
      return new HttpException(
        error.message,
        HttpStatus.BAD_REQUEST,
      );
    });
  }
}
