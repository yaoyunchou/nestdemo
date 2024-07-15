import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Panel } from '../one-panel-animation.entity';

export class CreatePanelAnimationDto {
  @IsString()
  @IsNotEmpty()
  totalContent: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  prompt: string;

  @IsNotEmpty()
  panels?: Partial<Panel>[] 
}
