import { Test, TestingModule } from '@nestjs/testing';
import { BiziService } from './bizi.service';

describe('BiziService', () => {
  let service: BiziService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BiziService],
    }).compile();

    service = module.get<BiziService>(BiziService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
