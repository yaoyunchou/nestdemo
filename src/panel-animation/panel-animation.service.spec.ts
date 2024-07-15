import { Test, TestingModule } from '@nestjs/testing';
import { PanelAnimationService } from './panel-animation.service';

describe('PanelAnimationService', () => {
  let service: PanelAnimationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PanelAnimationService],
    }).compile();

    service = module.get<PanelAnimationService>(PanelAnimationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
