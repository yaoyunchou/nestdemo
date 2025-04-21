import { Test, TestingModule } from '@nestjs/testing';
import { XyShopService } from './shop.service';

describe('ShopService', () => {
  let service: XyShopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [XyShopService],
    }).compile();

    service = module.get<XyShopService>(XyShopService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
