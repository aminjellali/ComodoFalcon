import { Test, TestingModule } from '@nestjs/testing';
import { PrerenderdAssetsController } from './prerenderd-assets.controller';

describe('PrerenderdAssets Controller', () => {
  let controller: PrerenderdAssetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrerenderdAssetsController],
    }).compile();

    controller = module.get<PrerenderdAssetsController>(PrerenderdAssetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
