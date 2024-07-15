import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PanelAnimationService } from './panel-animation.service';
import { CreatePanelAnimationDto } from './dto/create-panel-animation.dto';
import { UpdatePanelAnimationDto } from './dto/update-panel-animation.dto';
import { JwtGuard } from 'src/guards/jwt.guard';



@UseGuards(JwtGuard)
@Controller('panel-animation')
export class PanelAnimationController {
  constructor(private readonly panelAnimationService: PanelAnimationService) {}

  @Post()
  create(@Body() createPanelAnimationDto: CreatePanelAnimationDto) {
    return this.panelAnimationService.create(createPanelAnimationDto);
  }

  @Get()
  findAll() {
    return this.panelAnimationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log(id)
    const item = await this.panelAnimationService.findOne(+id);
    console.log(item)
    return item;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePanelAnimationDto: UpdatePanelAnimationDto) {
    return this.panelAnimationService.update(+id, updatePanelAnimationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.panelAnimationService.remove(+id);
  }
}
