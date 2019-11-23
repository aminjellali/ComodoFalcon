import {
  Controller,
  Body,
  Post,
  HttpException,
  HttpStatus,
  Get,
} from '@nestjs/common';
import {
  PreRenderRequestDTO,
  ElementToWaitForType,
} from './pre-renderer-controller-DTOs/preRenderRequestDTO';
import { PreRenderingEngineService } from './pre-renderer-services/pre-rendering-engine/pre-rendering-engine.service';
import { PreRenderedPageModel } from './models/preRenderedPageModel';
@Controller('pre-render')
export class PreRenderController {
  constructor(
    private readonly preRenderingEngineService: PreRenderingEngineService,
  ) {}
  @Get('get-all-pages')
  async getPrenderedPagesByInput(): Promise<PreRenderedPageModel[]> {
    return await this.preRenderingEngineService.getAllPreRenderedPages();
  }
  @Post('pre-render-page')
  preRenderWebPage(@Body() preRenderPageDTO: PreRenderRequestDTO) {
    return this.preRenderingEngineService
      .preRenderAndPersistPage(preRenderPageDTO.pageUrl)
      .then(resolved => {
        return resolved;
      })
      .catch(error => {
        return new HttpException(error.message , HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }
  public validatePreRenderRequest(
    preRenderPageDTO: PreRenderRequestDTO,
  ): boolean {
    if (!ElementToWaitForType[preRenderPageDTO.elementToWaitForType]) {
      throw new HttpException(
        `The provided elementToWaitForType is not valid - allowed values are [${Object.values(
          ElementToWaitForType,
        )}]`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }
}
