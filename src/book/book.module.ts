import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookView } from './entities/book.view.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookView])],
  controllers: [BookController],
  providers: [BookService]
})
export class BookModule {}
