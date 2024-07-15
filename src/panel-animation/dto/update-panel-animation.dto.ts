import { PartialType } from '@nestjs/swagger';
import { CreatePanelAnimationDto } from './create-panel-animation.dto';

export class UpdatePanelAnimationDto extends PartialType(CreatePanelAnimationDto) {}
