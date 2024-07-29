import { Injectable } from '@nestjs/common';
import { CreatePanelAnimationDto } from './dto/create-panel-animation.dto';
import { UpdatePanelAnimationDto } from './dto/update-panel-animation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PanelAnimation } from './panel-animation.entity';
import { Repository } from 'typeorm';
import { Panel } from './one-panel-animation.entity';

@Injectable()
export class PanelAnimationService {
  constructor(
  @InjectRepository(PanelAnimation) private readonly panelAnimationRepository: Repository<PanelAnimation>,
  @InjectRepository(Panel) private readonly onePanelRepository: Repository<Panel>){
    
  }
 
 
  async create(createPanelAnimationDto: CreatePanelAnimationDto) {
    console.log(createPanelAnimationDto)
    const panelAnimationDTO = await this.panelAnimationRepository.create({
      totalContent: createPanelAnimationDto.totalContent,
      prompt: createPanelAnimationDto.prompt,
      imageUrl: createPanelAnimationDto.imageUrl,
      panels: createPanelAnimationDto.panels,
      createTime: new Date().toLocaleString(),
      updateTime: new Date().toLocaleString(),
    });
    const panelAnimation = await this.panelAnimationRepository.save(panelAnimationDTO);
   
    return panelAnimation;
  }

  async findAll() {
     const list = await this.panelAnimationRepository.find({relations:['panels']});
     return list
  }

  findOne(id: number) {
    const item = this.panelAnimationRepository.findOne({where:{id},relations:['panels']});
    return item;
  }

  update(id: number, updatePanelAnimationDto: UpdatePanelAnimationDto) {
    return `This action updates a 333#${id} panelAnimation`;
  }

  remove(id: number) {
    return `This action removes a #${id} panelAnimation`;
  }
}
