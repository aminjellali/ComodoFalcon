import { Controller } from '@nestjs/common';
import { RequestsHandlingService } from '../rmq.services/requests-handling/requests-handling.service';
import { MessagePattern, EventPattern, ClientProxy, Client } from '@nestjs/microservices';
import { LoggerService } from 'src/logger/logger.services/logger.service';
import { Transport } from '@nestjs/common/enums/transport.enum';
import { PreRenderRequestDTO } from 'src/pre-renderer/pre-renderer-controller-DTOs/preRenderRequestDTO';
/**
 * Since we are in a synchronous context we want this code to be able to process multiple
 * links at a time which will present many issues, time out, memory, and cpu..
 * To solve this issue, we are using the famous messaging service RMQ, once a message is dropped
 * in the comodoFalcon_queue presented with the pre-render-pages pattern it will trigger the process that
 * will pre-render all the pages, and when finished it will send back a e-mail with a report containing 
 * info about the pre-rendering per link
 * and you could monitor the pre-rendered data using RMQ in your app by configuring it to listen on the
 * comodoFalcon_response queue.
 *
 * @export
 * @class RmqController
 */
@Controller('rmq')
export class RmqController {
    @Client({
        transport: Transport.RMQ, options: {
            urls: [`amqp://localhost:5672`],
            queue: 'comodoFalcon_preRendering_responses',
        },
    })
    client: ClientProxy;

    constructor(private readonly requestsHandlingService: RequestsHandlingService, private readonly logger: LoggerService) { }
    @MessagePattern('pre-render-pages')
    async preRenderMultiplePages(data: PreRenderRequestDTO[]) {
        const reponseData = await this.requestsHandlingService.preRenderMultiplePages(data);
        return this.client.send('res', reponseData);
    }
}
