import { Test, TestingModule } from '@nestjs/testing';
import { PersistanceLayerService } from './persistance-layer.service';

describe('PersistanceLayerService', () => {
  let service: PersistanceLayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersistanceLayerService],
    }).compile();

    service = module.get<PersistanceLayerService>(PersistanceLayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
