import { Test, TestingModule } from '@nestjs/testing';
import { RequestsHandlingService } from './requests-handling.service';

describe('RequestsHandlingService', () => {
  let service: RequestsHandlingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestsHandlingService],
    }).compile();

    service = module.get<RequestsHandlingService>(RequestsHandlingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
