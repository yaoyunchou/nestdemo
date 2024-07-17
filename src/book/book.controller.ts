import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookViewDto } from './dto/create-book-view.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(+id);
  }

  @Post('/view')
  createBookView(@Body() createBookViewDto: CreateBookViewDto) {

    console.log('createBookViewDto----------------', createBookViewDto)
    return this.bookService.createBookView(createBookViewDto);
  }
  @Get("/view/all")
  findAllBookView(@Query() query: any){
    return this.bookService.findAllBookView(query);
  }

  @Put('/view/:id')
  updateBookView(@Param('id') id: string, @Body() updateBookViewDto: Partial<CreateBookViewDto>) {
    return this.bookService.updateBookView(+id, updateBookViewDto);
  }
}
