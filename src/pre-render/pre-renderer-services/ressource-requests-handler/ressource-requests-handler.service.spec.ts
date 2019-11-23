import { Test, TestingModule } from '@nestjs/testing';
import { RessourceRequestsHandlerService } from './ressource-requests-handler.service';

describe('RessourceRequestsHandlerService', () => {
  let service: RessourceRequestsHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RessourceRequestsHandlerService],
    }).compile();

    service = module.get<RessourceRequestsHandlerService>(RessourceRequestsHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
