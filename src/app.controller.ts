import { Controller, Get } from '@nestjs/common';
import { Public } from './decorators/public.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller()
@ApiTags('system')
export class AppController {
  @Public()
  @Get('health')
  @ApiOperation({ summary: '健康检查' })
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString()
    };
  }
} 