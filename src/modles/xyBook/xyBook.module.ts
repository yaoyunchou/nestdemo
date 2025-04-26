import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { XyBook } from './entities/xyBook.entity';
import { XyBookData } from './entities/xyBookData.entity';
import { XyShop } from '../xyShop/entities/xyShop.entity';
import { XyBookController } from './xyBook.controller';
import { XyBookService } from './xyBook.service';
import { XyBookImportService } from './xyBook.import.service';
import { XyGoodInfo } from './entities/xyGoodInfo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([XyBook, XyBookData, XyShop, XyGoodInfo])
  ],
  controllers: [XyBookController],
  providers: [XyBookService, XyBookImportService],
  exports: [XyBookService, XyBookImportService],
})
export class XyBookModule {} 