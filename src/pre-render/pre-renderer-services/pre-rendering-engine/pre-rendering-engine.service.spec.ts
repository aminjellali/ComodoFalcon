import { Test, TestingModule } from '@nestjs/testing';
import { PreRenderingEngineService } from './pre-rendering-engine.service';

describe('PreRenderingEngineService', () => {
  let service: PreRenderingEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreRenderingEngineService],
    }).compile();

    service = module.get<PreRenderingEngineService>(PreRenderingEngineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
