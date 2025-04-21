import { PartialType } from '@nestjs/swagger';
import { CreateXyBookDto } from './create-xyBook.dto';

export class UpdateXyBookDto extends PartialType(CreateXyBookDto) {} 