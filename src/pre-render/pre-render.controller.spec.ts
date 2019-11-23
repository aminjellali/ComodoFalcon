import { Test, TestingModule } from '@nestjs/testing';
import { PreRenderController } from './pre-render.controller';

describe('PreRender Controller', () => {
  let controller: PreRenderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreRenderController],
    }).compile();

    controller = module.get<PreRenderController>(PreRenderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
