import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PanelAnimationService } from './panel-animation.service';
import { CreatePanelAnimationDto } from './dto/create-panel-animation.dto';
import { UpdatePanelAnimationDto } from './dto/update-panel-animation.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@UseGuards(JwtGuard)
@Controller('panel-animation')
@ApiTags('panel-animation')
export class PanelAnimationController {
  constructor(private readonly panelAnimationService: PanelAnimationService) {}

  @Post()
  @ApiOperation({ summary: '创建动画', operationId: 'createPanelAnimation' })
  @ApiBody({ type: CreatePanelAnimationDto })
  @ApiResponse({ status: 201, description: '创建成功' })
  create(@Body() createPanelAnimationDto: CreatePanelAnimationDto) {
    return this.panelAnimationService.create(createPanelAnimationDto);
  }

  @Get()
  @ApiOperation({ summary: '获取动画列表' })
  @ApiResponse({ status: 200, description: '获取成功' })
  findAll() {
    return this.panelAnimationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个动画' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findOne(@Param('id') id: string) {
    console.log(id)
    const item = await this.panelAnimationService.findOne(+id);
    console.log(item)
    return item;
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新动画' })
  @ApiBody({ type: UpdatePanelAnimationDto })
  @ApiResponse({ status: 200, description: '更新成功' })
  update(@Param('id') id: string, @Body() updatePanelAnimationDto: UpdatePanelAnimationDto) {
    return this.panelAnimationService.update(+id, updatePanelAnimationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.panelAnimationService.remove(+id);
  }
}
