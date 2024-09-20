import { Module } from '@nestjs/common';
import { BiziService } from './bizi.service';
import { BiziController } from './bizi.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BZImage } from './entities/bzImage.entity';
import { Bizi } from './entities/bizi.entity';
import { XyShop } from 'src/shop/entities/xyShop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bizi,BZImage,XyShop])],
  controllers: [BiziController],
  providers: [BiziService]
})
export class BiziModule {}
