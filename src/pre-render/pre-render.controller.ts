import { Controller, Body, Post, HttpException, HttpStatus } from '@nestjs/common';
import { PreRenderRequestDTO, ElementToWaitForType } from './pre-render-controller-DTOs/preRenderRequestDTO';
import { throwError } from 'rxjs';
import { PreRenderingEngineService } from './pre-rendering-engine/pre-rendering-engine.service';
@Controller('pre-render')
export class PreRenderController {
    constructor(private preRenderingEngineService: PreRenderingEngineService) {
        // this.preRenderingEngineService = 
    }
    @Post('pre-')
    getPrenderedPagesByInput(): string {
        return 'Am alive';
    }
    @Post('pre-render-page')
    preRenderWebPage(@Body() preRenderPageDTO: PreRenderRequestDTO): string {
        this.validatePreRenderRequest(preRenderPageDTO);
        return JSON.stringify(preRenderPageDTO);
    }
    public validatePreRenderRequest(preRenderPageDTO: PreRenderRequestDTO): boolean {
        if (!ElementToWaitForType[preRenderPageDTO.elementToWaitForType]) {
            throw new HttpException(`The provided elementToWaitForType is not valid - allowed values are [${Object.values(ElementToWaitForType)}]`,
                HttpStatus.BAD_REQUEST);
        }
        return true;
    }
}
