import { Injectable } from '@nestjs/common';
import { PreRenderingEngineService } from 'src/pre-renderer/pre-renderer-services/pre-rendering-engine/pre-rendering-engine.service';
import { PreRenderRequestDTO } from 'src/pre-renderer/pre-renderer-controller-DTOs/preRenderRequestDTO';
import { ResponseStatus, PreRendringStatus } from './responseStatus';
import { LoggerService } from 'src/logger/logger.services/logger.service';
@Injectable()
export class RequestsHandlingService {
    constructor(private readonly preRenderingEngineService: PreRenderingEngineService, private readonly logger: LoggerService) { }
    // each page will take more than
    async preRenderMultiplePages(preRenderingPagesRequest: PreRenderRequestDTO[]): Promise<ResponseStatus[]> {
        return new Promise<ResponseStatus[]>(async (resolve) => {
            const responseArray: ResponseStatus[] = [];
            for (const preRenderingRequest of preRenderingPagesRequest) {
                try {
                    const value = await this.preRenderingEngineService.preRenderAndPersistPage(
                        preRenderingRequest.pageUrl, preRenderingRequest.elementToWaitFor);
                    responseArray.push(
                        {
                            pageUrl: value.preRenderingReport.pageUrl,
                            pagePreRenderingStatus: PreRendringStatus.SUCCESS,
                            preRenderingReport: value.preRenderingReport,
                        },
                    );
                } catch (error) {
                    responseArray.push(
                        {
                            pageUrl: preRenderingRequest.pageUrl,
                            pagePreRenderingStatus: PreRendringStatus.ERROR,
                            message: error.message,
                        },
                    );
                }
            }
            resolve(responseArray);
        });

    }

}
