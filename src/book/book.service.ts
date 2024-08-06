import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { In, Repository, getRepository } from 'typeorm';
import { BookView } from './entities/book.view.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookViewDto } from './dto/create-book-view.dto';
import * as _ from 'lodash';
import { Book } from './entities/book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookView) private readonly bookViewRepository: Repository<BookView>,
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>){

    }
  async create(createBookDto: CreateBookDto) {
    const checkData = await this.bookRepository.findOne({where: {isbn: createBookDto.isbn} });
    console.log(checkData)

    if(checkData) {
      const result =  this.bookRepository.update(checkData.id, createBookDto);
      console.log('result----------------', result)
      return '数据已存在, 书籍进行更新';
    }else {
      const result = await this.bookRepository.create(createBookDto);
      const createBookInfo = await this.bookRepository.save(result);
      return createBookInfo;
    }
   
  }

  async findAll(query) {
    console.log('query----------------', query)
    const newQuery = _.omit(query, ['page', 'pageSize'])
    // const whereParams =  Object.keys(newQuery).map(key => {
    //   return { [key]: newQuery[key] }
    // })
    // console.log('listResult----------------', whereParams)
    // const total = this.bookRepository.find({
    //   where: whereParams.length? whereParams : {}}).getCount();
    // const bookList = this.bookRepository.find({
    //   where: whereParams.length? whereParams : {},
     
    //   take: query?.pageSize|| 10,
    //   skip: ((query.page || 1) - 1) * (query.pageSize || 10),
    
    // });
    const queryBuilder =  this.bookRepository.createQueryBuilder("book"); // "book" 是实体别名
    Object.keys(newQuery).forEach(key => {
      queryBuilder.andWhere(`${key} = :${key}`, newQuery);
    });
   
    // 计算满足筛选条件的记录总数
    const count = await queryBuilder.getCount();
    // 应用分页
    const queryPage = Number(query.page) || 1;
    const queryPageSize = Number(query.pageSize) || 10;
    queryBuilder.skip((queryPage - 1) * queryPageSize).take(queryPageSize);
    // 使用leftJoinAndSelect来加载关联的images
    queryBuilder.leftJoinAndSelect("book.images", "image")
    .select(["book.id", "book.title","book.isbn", "book.price","book.author", "book.publisher", "image.id", "image.url"]);;
     // 获取当前页的书籍
    const books = await queryBuilder.getMany();
    return {
      total: count,
      books
    };
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
