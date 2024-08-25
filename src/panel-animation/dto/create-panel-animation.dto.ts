import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Panel } from '../one-panel-animation.entity';

export class CreatePanelAnimationDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  article: string;

  @IsNotEmpty()
  chapters?: Partial<Panel>[] 
}
