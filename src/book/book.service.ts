import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { In, Repository, getRepository } from 'typeorm';
import { BookView } from './entities/book.view.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookViewDto } from './dto/create-book-view.dto';
import * as _ from 'lodash';
import { Book } from './entities/book.entity';
import { XyShop } from 'src/shop/entities/xyShop.entity';
import { Image } from './entities/image.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookView) private readonly bookViewRepository: Repository<BookView>,
    @InjectRepository(XyShop) private readonly xyShopRepository: Repository<XyShop>,
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>){

    }
  async create(createBookDto: CreateBookDto) {
    const checkData = await this.bookRepository.findOne({where: {isbn: createBookDto.isbn} });
    console.log(checkData)

    if(checkData) {
      const result =  await this.update(checkData.id, createBookDto);
      console.log('result----------------', result)
      return {
        data: result,
        msg: '数据已存在，已更新',
      };
    }else {
      const result = await this.bookRepository.create(createBookDto);
      const createBookInfo = await this.bookRepository.save(result);
      return {
        data: createBookInfo,
        msg: '新增数据成功',
      }; ;
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
      queryBuilder.andWhere(`book.${key} = :${key}`, newQuery);
    });
   
    // 计算满足筛选条件的记录总数
    const count = await queryBuilder.getCount();
    // 应用分页
    const queryPage = Number(query.page) || 1;
    const queryPageSize = Number(query.pageSize) || 10;
    queryBuilder.skip((queryPage - 1) * queryPageSize).take(queryPageSize);
    // 使用leftJoinAndSelect来加载关联的images
    queryBuilder.leftJoinAndSelect("book.images", "image")
    .leftJoinAndSelect("book.xyShops", "xyShop")
    .orderBy("book.updatedAt", "DESC")
    .select(["book.id", "book.title","book.isbn", "book.price","book.updatedAt", "book.author", "book.publisher", "image.id", "image.url", "xyShop.id", "xyShop.shopName"]);
     // 获取当前页的书籍
    const books = await queryBuilder.getMany();
    return {
      total: count,
      books
    };
  }

  async findOneById(id: number) {
    const item = await this.bookRepository.findOne({where: {id},relations: ['xyShops', 'images']});
    return item;
  }
  // async findOne(query: Partial<Book>) {
  //   const item = await this.bookRepository.findOne({where: query});
  //   return item;
  // }
  async update(id: number, updateBookDto: UpdateBookDto) {
    // const queryBuilder =  this.bookRepository.createQueryBuilder("book"); // "book" 是实体别名
    const book = await this.bookRepository.findOne({where: {id}, relations: ['xyShops', 'images']});
    
    // 如果有shop字段
    if(updateBookDto.xyShops) {
      // 查看是否已經关联了
    
      console.log('book----------------', book)
      // 查看更新数据是否已经和当前书籍做了关联
      const shopNameList = book.xyShops.map(xyShops => xyShops.shopName);
      // 找出没有被关联的，把没有关联的数据放进book.shops中
      for(let i =0; i< updateBookDto.xyShops.length; i++) {
        const shop = updateBookDto.xyShops[i];
        if(!shopNameList.includes(shop.shopName)) {
          // 通过shopName找到数据库中对应的shop
          const shopInfo = await this.xyShopRepository.findOne({where: {shopName: shop.shopName}});
          book.xyShops.push(shopInfo);
        }
      }
    
    }

    // 如果有images字段
    if(updateBookDto.images) {
      // 查看是否已經关联了
      const imageList = book.images.map(images => images.url);
      // 找出没有被关联的，把没有关联的数据放进book.images中
      for(let i =0; i< updateBookDto.images.length; i++) {
        const image = updateBookDto.images[i];
        if(!imageList.includes(image.url)) {

          book.images.push(image as Image);
        }
      }
    }
    const newBook = Object.assign(book, _.omit(updateBookDto, ['xyShops', 'images', 'id']));
  
    const result = await this.bookRepository.save(newBook);
      console.log(result)
      return result;
  }

  remove(id: number) {
    return this.bookRepository.delete(id);
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
