import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, In } from 'typeorm';
import { XyBook } from './entities/xyBook.entity';
import { CreateXyBookDto } from './dto/create-xyBook.dto';
import { UpdateXyBookDto } from './dto/update-xyBook.dto';
import { QueryXyBookDto } from './dto/query-xyBook.dto';
import { XyBookData } from './entities/xyBookData.entity';
import { XyGoodInfo } from './entities/xyGoodInfo.entity';
import { QueryXyOneBookDto } from './dto/query-xyOneBook.dto';
/**
 * 闲鱼书籍服务类
 * 提供闲鱼书籍相关的业务逻辑处理
 */
@Injectable()
export class XyBookService {
  constructor(
    @InjectRepository(XyBook)
    private readonly xyBookRepository: Repository<XyBook>,
    @InjectRepository(XyBookData)
    private readonly xyBookDataRepository: Repository<XyBookData>,
    @InjectRepository(XyGoodInfo)
    private readonly xyGoodInfoRepository: Repository<XyGoodInfo>,
  ) {}

  /**
   * 创建新的闲鱼书籍记录
   * @param createXyBookDto 创建书籍的DTO对象
   * @returns 新创建的书籍实体
   */
  async create(createXyBookDto: CreateXyBookDto){
    try {
      const book = this.xyBookRepository.create(createXyBookDto);
      // updateAt 和 createAt  是自动生成的
      // 先保存 book_data ,需要对book_data 的 author 进行处理,不能超过100
      const author = createXyBookDto.book_data.author;
      const bookDataInput = {
        ...createXyBookDto.book_data,
        author: author.substring(0, 100)
      }
      
      const bookData = this.xyBookDataRepository.create(bookDataInput);
      await this.xyBookDataRepository.save(bookData);
      
      // 处理 publish_shop 数组
      const publishShops = await Promise.all(
        createXyBookDto.publish_shop.map(async (shop) => {
          const goodInfo = this.xyGoodInfoRepository.create(shop);
          return await this.xyGoodInfoRepository.save(goodInfo);
        })
      );
      
      // 设置书籍的商品关联
      book.publish_shop = publishShops as any; 
      return await this.xyBookRepository.save(book);
    } catch (error) {
       throw new Error(error);
    }
   
  }

  /**
   * 查询闲鱼书籍列表
   * @param query 查询参数，包含搜索、筛选、分页等信息
   * @returns 包含书籍列表和总数的对象
   */
  async findAll(query: QueryXyBookDto) {
    const { page = 1, pageSize = 10, sortBy = 'createAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.xyBookRepository.createQueryBuilder('xyBook');
    // 需要联动获取 book_data 和 publish_shop 的数据
    queryBuilder.leftJoinAndSelect('xyBook.bookData', 'bookData');
    queryBuilder.leftJoinAndSelect('xyBook.publishShop', 'publishShop');

    // 添加搜索条件
    if (query.search) {
      queryBuilder.where('xyBook.title LIKE :search OR xyBook.isbn LIKE :search', {
        search: `%${query.search}%`,
      });
    }

    // 添加状态筛选
    if (query.product_status !== undefined) {
      queryBuilder.andWhere('xyBook.product_status = :product_status', {
        product_status: query.product_status,
      });
    }
    // 添加店铺筛选
    if (query.shopName) {
      queryBuilder.andWhere('xyBook.shopName = :shopName', {
        shopName: query.shopName,
      });
    }

    // 添加曝光状态筛选
    if (query.ISBN !== undefined) {
      queryBuilder.andWhere('xyBook.ISBN = :ISBN', {
        ISBN: query.ISBN,
      });
    }

    // 添加排序
    queryBuilder.orderBy(`xyBook.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');

    // 获取总数
    const total = await queryBuilder.getCount();

    // 获取分页数据
    const items = await queryBuilder.skip(skip).take(pageSize).getMany();

    return { items, total };
  }

  /**
   * 根据ID获取单个闲鱼书籍详情
   * @param id 书籍ID
   * @returns 书籍实体
   * @throws NotFoundException 当书籍不存在时抛出异常
   */
  async findOne(id: string): Promise<XyBook> {
    const book = await this.xyBookRepository.findOne({ 
      where: { _id: id },
      relations: ['book_data',"publish_shop"] //  加载关联的书籍数据
    });
    if (!book) {
        return null
    }
    return book;
  }

  /**
   * 更新闲鱼书籍信息
   * @param id 书籍ID
   * @param updateXyBookDto 更新的书籍信息
   * @returns 更新后的书籍实体
   * @throws NotFoundException 当书籍不存在时抛出异常
   */
  async update(id: string, updateXyBookDto: UpdateXyBookDto): Promise<XyBook> {
    // 使用 QueryRunner 来管理事务
    const queryRunner = this.xyBookRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 获取并更新书籍基本信息
      const book = await this.findOne(id);
      if (!book) {
        throw new NotFoundException(`未找到ID为 ${id} 的书籍`);
      }
      
      const { book_data, publish_shop, ...bookUpdateData } = updateXyBookDto;
      Object.assign(book, bookUpdateData);

      // 2. 更新 book_data
      if (book_data) {
        await queryRunner.manager.update(
          XyBookData,
          { isbn: book.book_data.isbn },
          book_data
        );
      }

      // 3. 处理 publish_shop 关联
      if (publish_shop?.length > 0) {
        // 获取所有需要更新的ID
        const itemIds = publish_shop.map(shop => shop.item_id).filter(itemId => itemId);
        
        // 先验证所有ID是否存在
        const existingShops = await queryRunner.manager.find(
          XyGoodInfo,
          { where: { item_id: In(itemIds) } }
        );

        if (existingShops.length !== itemIds.length) {
          throw new NotFoundException('部分商品信息不存在');
        }

        // 批量更新商品信息并设置关联
        await Promise.all(
          existingShops.map(shop => {
            const updateData =  publish_shop.find(s => s.item_id === shop.item_id);
            if (updateData) {
              Object.assign(shop, updateData);
              shop.book = book; // 设置关联
            }
            return queryRunner.manager.save(shop);
          })
        );
      }

      // 4. 保存书籍更新
      const savedBook = await queryRunner.manager.save(XyBook, book);

      // 提交事务
      await queryRunner.commitTransaction();
      
      // 返回更新后的完整数据
      return await this.findOne(id);

    } catch (error) {
      // 回滚事务
      await queryRunner.rollbackTransaction();
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new Error(`更新书籍失败: id: ${id} ${error.message}`);
    } finally {
      // 释放queryRunner
      await queryRunner.release();
    }
  }

  /**
   * 删除闲鱼书籍
   * @param id 书籍ID
   * @throws NotFoundException 当书籍不存在时抛出异常
   */
  async remove(id: string): Promise<void> {
    const result = await this.xyBookRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`闲鱼书籍ID ${id} 不存在`);
    }
  }
  /**
   * 根据其他数据的相关参数，获取对应的一本闲鱼书籍
   * title 当书籍名称包含这个title的数据  （模糊查询）
   * product_status 当产品状态是  product_status的数据 （精确查询）
   * shopName 当店铺名称是shopName的数据 （精确查询）
   * ISBN 当ISBN是ISBN的数据 （精确查询）
   * 
   * @param query 查询参数对象
   * @returns 包含书籍列表和总数的对象
   */
  async getByOtherData(query: QueryXyOneBookDto): Promise<XyBook> {
    const { search, product_id, shopName, title, ISBN} = query;
    const queryBuilder = this.xyBookRepository.createQueryBuilder('xyBook');
    queryBuilder.leftJoinAndSelect('xyBook.bookData', 'bookData');
    queryBuilder.leftJoinAndSelect('xyBook.publishShop', 'publishShop');
    // 添加搜索条件
    if (search) {
      queryBuilder.where('xyBook.title LIKE :search OR xyBook.content LIKE :search', { 
        search: `%${search}%`,  
      });
    }
    // 添加产品状态筛选
    if (product_id) {
      queryBuilder.andWhere('xyBook.product_id = :product_id', {
        product_id: product_id, 
      });
    }
    // 添加店铺名称筛选
    if (shopName) {
      queryBuilder.andWhere('xyBook.shopName = :shopName', {
        shopName: shopName,
      });
    }
    // 添加标题筛选
    if (title) {
      queryBuilder.andWhere('xyBook.title = :title', {
        title: title,     
      });
    }
    // 添加ISBN筛选
    if (ISBN) {
      queryBuilder.andWhere('xyBook.ISBN = :ISBN', {
        ISBN: ISBN,
      });
    }
    // 添加排序
    queryBuilder.orderBy('xyBook.createAt', 'DESC');
    // 获取分页数据
    const items = await queryBuilder.getMany();
    // 返回第一条数据
    return items?.[0] || null;
  }
  /**
   * 处理异常数据
   * 1. item_id相同的两个数据删除一个
   * 
   * @returns 处理结果
   */
  async handleDuplicateData(): Promise<{ success: number; errors: number }> {
    let successCount = 0;
    let errorCount = 0;

    try {
      // 获取所有数据
      const allRecords = await this.xyGoodInfoRepository
        .createQueryBuilder('info')
        .orderBy('info.id', 'DESC')
        .getMany();

      // 按item_id分组,保留id最大的记录
      const groupedByItemId = new Map();
      allRecords.forEach(record => {
        if (!groupedByItemId.has(record.item_id) || 
            groupedByItemId.get(record.item_id).id < record.id) {
          groupedByItemId.set(record.item_id, record);
        }
      });

      // 删除重复记录
      for (const record of allRecords) {
        if (groupedByItemId.get(record.item_id).id !== record.id) {
          await this.xyGoodInfoRepository.delete(record.id);
          successCount++;
        }
      }
    } catch (error) {
      console.error('处理重复数据失败:', error);
      errorCount++;
    }

    return {
      success: successCount,
      errors: errorCount
    };
   
   

  }
  
} 