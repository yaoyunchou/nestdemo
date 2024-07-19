import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Repository } from 'typeorm';
import { BookView } from './entities/book.view.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookViewDto } from './dto/create-book-view.dto';
import * as _ from 'lodash';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookView) private readonly bookViewRepository: Repository<BookView>) {
     
  }
  create(createBookDto: CreateBookDto) {
    return 'This action adds a new book';
  }

  findAll() {
    return `This action returns all book`;
  }

  findOne(id: number) {
    return `This action returns a  666 ddd #${id} book`;
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a 4444#${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }

  // 书籍曝光数据
  async createBookView(createBookViewDto: CreateBookViewDto) {
    // 检查是否当前日期的数据已经有了， 有了则走更新， 没有则走创建
    const checkData = await this.bookViewRepository.findOne({where: {productId: createBookViewDto.productId, createTimestamp: createBookViewDto.createTimestamp}});

    if(checkData) {
      return this.bookViewRepository.update(checkData.id, createBookViewDto);
    }else{
      const result = await this.bookViewRepository.create(createBookViewDto);
      const bookView = await this.bookViewRepository.save(result);
      return bookView;
    }
    
  }

  // 获取书籍曝光数据
  async findAllBookView(query) {
    console.log('query----------------', query)
    const newQuery = _.omit(query, ['page', 'pageSize'])
    const whereParams =  Object.keys(newQuery).map(key => {
      return { [key]: newQuery[key] }
    })
    console.log('listResult----------------', whereParams)

    const listResult = await this.bookViewRepository.find(
      {
        where: whereParams.length? whereParams : {},
       
        take: query.pageSize,
        skip: (query.page - 1) * query.pageSize,
      
      }
    );
    return listResult
  }
  // 更新书籍曝光数据
  updateBookView(id: number, updateBookViewDto: Partial<CreateBookViewDto>) {
    return this.bookViewRepository.update(id, updateBookViewDto);
    // return `This action updates a #${id} bookView`;
  }

  // 获取书籍曝光数据
  async findBookView(query: BookView) {
    const bookView = await this.bookViewRepository.findOne({where: {...query}});
    return bookView;
  }
}
