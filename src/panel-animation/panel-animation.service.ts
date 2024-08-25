import { Injectable } from '@nestjs/common';
import { pick } from 'lodash';
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
    // 组装panels 数据
    const panels = []
    createPanelAnimationDto.chapters.map((item,index)=>{
      console.log('lodash--------------', pick)
      const panel:any =  pick(item, ['prompt','promptImage','content','title','desc'])
      panel.index = index
      const images = item.images.map((url)=>{
        return {
          url,
          combinedPicture:false
        }
      })
      images.push({
        url: item.combinedPicture,
        combinedPicture:true
      })
      panel.images = images
      panels.push(panel)
    })

    
    const saveData = {
      totalContent: createPanelAnimationDto.article,
      prompt: createPanelAnimationDto.content,
      title: createPanelAnimationDto.title,
      panels
    }
    console.log('------------------------------', panels)
    const panelAnimationDTO = this.panelAnimationRepository.create(saveData);
    const panelAnimation = await this.panelAnimationRepository.save(panelAnimationDTO);
   
    return panelAnimation;
  }

  async findAll() {
     const list = await this.panelAnimationRepository.find({relations:['panels', 'panels.images']});
     return list
  }

  findOne(id: number) {
    const item = this.panelAnimationRepository.findOne({where:{id},relations:['panels','panels.images']});
    return item;
  }

  update(id: number, updatePanelAnimationDto: UpdatePanelAnimationDto) {
    return `This action updates a 333#${id} panelAnimation`;
  }

  remove(id: number) {
    return this.panelAnimationRepository.delete(+id,);
  }
}
