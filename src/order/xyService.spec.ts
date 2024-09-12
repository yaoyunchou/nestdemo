import { Test, TestingModule } from '@nestjs/testing';
import { XYAPIService } from './xyService';

describe('XYAPIService', () => {
  let service: XYAPIService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [XYAPIService],
    }).compile();

    service = module.get<XYAPIService>(XYAPIService);

  });

  it('should be defined', async() => {
    // expect(service).toBeDefined();
	const data = await service.xyRequest('xxxx', {shopName: '蓝小飞鱼'}, 'POST');
	console.log(' -- data--', data);
  });
});
