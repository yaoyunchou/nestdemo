import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookViewDto } from './dto/create-book-view.dto';
import { responseWarp } from 'src/utils/common';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    
    const book = await this.bookService.create(createBookDto);
    if(book.msg) {
      return responseWarp(book.data, 0, book.msg);
    }else{
      return responseWarp(book, 1, '新增失败了');
    }
  }

  @Get()
  async findAll(@Query() query: any) {
    if(query?.id){
      query.id = +query.id;
    }
    const bookDataInfo = await this.bookService.findAll(query);
    return  responseWarp({list: bookDataInfo.books, total: bookDataInfo.total, page: query.page|| 1, pageSize: query.pageSize ||10});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.bookService.findOneById(+id);
    if(!data) {
      return responseWarp(null, 400, '数据不存在');
    }else{
      return responseWarp(data);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    const result = await this.bookService.update(+id, updateBookDto);
    return responseWarp(result);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result =  await this.bookService.remove(+id);
    return responseWarp(result);
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
