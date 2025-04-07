import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import {CreateImageDto} from './dto/create-image.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookViewDto } from './dto/create-book-view.dto';
import { responseWarp } from 'src/utils/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/jwt.guard';
import { ListResponse } from 'src/interfaces/response.interface';
import { Public } from '../decorators/public.decorator';

@UseGuards(JwtGuard)
@Controller('book')
@ApiTags('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiOperation({ summary: '创建图书', operationId: 'createBook' })
  async create(@Body() createBookDto: CreateBookDto) {
    const book = await this.bookService.create(createBookDto);
    return book;
  }

  @Get()
  @ApiOperation({ summary: '获取图书列表', operationId: 'findAllBook' })
  async findAll(@Query() query: any): Promise<BaseResponse<ListResponse<CreateBookDto>>> {
    const { books, total } = await this.bookService.findAll(query);
    return responseWarp({
      list: books,
      total,
      page: Number(query.page) || 1,
      pageSize: Number(query.pageSize) || 10
    });
  }

  @Get(':id')
  @ApiOperation({ summary: '获取图书详情', operationId: 'findOneBook' })
  async findOne(@Param('id') id: string) {
    const data = await this.bookService.findOneById(+id);
    if(!data) {
      return responseWarp(null, 400, '数据不存在');
    }else{
      return responseWarp(data);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新图书', operationId: 'updateBook' })
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    const result = await this.bookService.update(+id, updateBookDto);
    return responseWarp(result);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除图书', operationId: 'deleteBook' })
  async remove(@Param('id') id: string) {
    const result =  await this.bookService.remove(+id);
    return responseWarp(result);
  }

  @Public()
  @Post('/view')
  @ApiOperation({ 
    summary: '创建图书视图', 
    operationId: 'createBookView',
    description: '公开接口，无需认证'
  })
  @ApiResponse({ status: 201, description: '创建成功' })
  createBookView(@Body() createBookViewDto: CreateBookViewDto) {
    return this.bookService.createBookView(createBookViewDto);
  }
  
  @Get("/view/all")
  @ApiOperation({ summary: '获取所有图书视图', operationId: 'findAllBookView' })
  findAllBookView(@Query() query: any, @Body() CreateImage: CreateImageDto) {
    return this.bookService.findAllBookView(query);
  }

  @Put('/view/:id')
  @ApiOperation({ summary: '更新图书视图', operationId: 'updateBookView' })
  updateBookView(@Param('id') id: string, @Body() updateBookViewDto: Partial<CreateBookViewDto>) {
    return this.bookService.updateBookView(+id, updateBookViewDto);
  }
}
