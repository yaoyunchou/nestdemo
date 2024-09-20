import { PartialType } from '@nestjs/swagger';
import { CreateBiziDto } from './create-bizi.dto';

export class UpdateBiziDto extends PartialType(CreateBiziDto) {}
