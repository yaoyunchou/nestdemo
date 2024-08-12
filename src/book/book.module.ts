import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookView } from './entities/book.view.entity';
import { Book } from './entities/book.entity';
import { Image } from './entities/image.entity';
import { XyShop } from 'src/shop/entities/xyShop.entity';


@Module({
  imports: [TypeOrmModule.forFeature([BookView, Book, Image, XyShop])],
  controllers: [BookController],
  providers: [BookService]
})
export class BookModule {}
