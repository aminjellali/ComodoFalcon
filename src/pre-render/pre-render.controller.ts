import { Controller, Body, Post, HttpException, HttpStatus, Get } from '@nestjs/common';
import { PreRenderRequestDTO, ElementToWaitForType } from './pre-render-controller-DTOs/preRenderRequestDTO';
import { PreRenderingEngineService } from './pre-renderer-services/pre-rendering-engine/pre-rendering-engine.service';
import { PreRenderedPageModel } from './models/preRenderedPageModel';
@Controller('pre-render')
export class PreRenderController {
    constructor(private readonly preRenderingEngineService: PreRenderingEngineService) {
        // this.preRenderingEngineService = 
    }
    @Get('get-all-pages')
    async getPrenderedPagesByInput(): Promise<PreRenderedPageModel[]> {
        return await this.preRenderingEngineService.getAllPreRenderedPages();
    }
    @Post('pre-render-page')
    async preRenderWebPage(@Body() preRenderPageDTO: PreRenderRequestDTO): Promise<PreRenderedPageModel> {
        return await this.preRenderingEngineService.preRenderPage(preRenderPageDTO.pageUrl);
         // JSON.stringify(preRenderPageDTO);
    }
    public validatePreRenderRequest(preRenderPageDTO: PreRenderRequestDTO): boolean {
        if (!ElementToWaitForType[preRenderPageDTO.elementToWaitForType]) {
            throw new HttpException(`The provided elementToWaitForType is not valid - allowed values are [${Object.values(ElementToWaitForType)}]`,
                HttpStatus.BAD_REQUEST);
        }
        return true;
    }
}
