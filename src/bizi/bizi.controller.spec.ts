import { Test, TestingModule } from '@nestjs/testing';
import { BiziController } from './bizi.controller';
import { BiziService } from './bizi.service';

describe('BiziController', () => {
  let controller: BiziController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BiziController],
      providers: [BiziService],
    }).compile();

    controller = module.get<BiziController>(BiziController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
