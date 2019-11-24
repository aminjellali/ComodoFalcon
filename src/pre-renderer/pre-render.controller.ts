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
@Controller('pre-render')
export class PreRenderController {
  constructor(
    private readonly preRenderingEngineService: PreRenderingEngineService,
  ) { }
  @Get('get-all-pages')
  async getPrenderedPagesByInput(): Promise<PreRenderedPageModel[]> {
    return await this.preRenderingEngineService.getAllPreRenderedPages();
  }
  @Post('get-page-by-url')
  async getPrenderedPagesByUrl(
    @Body() getPageUrl,
  ): Promise<PreRenderedPageModel> {
    return await this.preRenderingEngineService.getPreRenderedPageByUrl(
      getPageUrl.url,
    );
  }
  @Post('pre-render-page')
  preRenderWebPage(@Body() preRenderPageDTO: PreRenderRequestDTO) {
    return this.preRenderingEngineService
      .preRenderAndPersistPage(preRenderPageDTO.pageUrl, preRenderPageDTO.elementToWaitFor)
      .then(resolved => {
        return resolved;
      })
      .catch(error => {
        return new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
  }
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
