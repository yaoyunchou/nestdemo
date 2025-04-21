import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { XyBook } from './entities/xyBook.entity';
import { BookData } from './entities/bookData.entity';
import { XyShop } from '../xyShop/entities/xyShop.entity';
import { XyBookController } from './xyBook.controller';
import { XyBookService } from './xyBook.service';
import { XyBookImportService } from './xyBook.import.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([XyBook, BookData, XyShop])
  ],
  controllers: [XyBookController],
  providers: [XyBookService, XyBookImportService],
  exports: [XyBookService, XyBookImportService],
})
export class XyBookModule {} 