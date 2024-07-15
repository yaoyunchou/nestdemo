import { Test, TestingModule } from '@nestjs/testing';
import { PanelAnimationController } from './panel-animation.controller';
import { PanelAnimationService } from './panel-animation.service';

describe('PanelAnimationController', () => {
  let controller: PanelAnimationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PanelAnimationController],
      providers: [PanelAnimationService],
    }).compile();

    controller = module.get<PanelAnimationController>(PanelAnimationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
