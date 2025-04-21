import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { XyBook } from './entities/xyBook.entity';
import { CreateXyBookDto } from './dto/create-xyBook.dto';
import { UpdateXyBookDto } from './dto/update-xyBook.dto';
import { QueryXyBookDto } from './dto/query-xyBook.dto';

/**
 * 闲鱼书籍服务类
 * 提供闲鱼书籍相关的业务逻辑处理
 */
@Injectable()
export class XyBookService {
  constructor(
    @InjectRepository(XyBook)
    private readonly xyBookRepository: Repository<XyBook>,
  ) {}

  /**
   * 创建新的闲鱼书籍记录
   * @param createXyBookDto 创建书籍的DTO对象
   * @returns 新创建的书籍实体
   */
  async create(createXyBookDto: CreateXyBookDto){
    const book = this.xyBookRepository.create(createXyBookDto);
    return await this.xyBookRepository.save(book);
  }

  /**
   * 查询闲鱼书籍列表
   * @param query 查询参数，包含搜索、筛选、分页等信息
   * @returns 包含书籍列表和总数的对象
   */
  async findAll(query: QueryXyBookDto) {
    const { page = 1, limit = 10, sortBy = 'createAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.xyBookRepository.createQueryBuilder('xyBook');

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
    if (query.shopID) {
      queryBuilder.andWhere('xyBook.shopID = :shopID', {
        shopID: query.shopID,
      });
    }

    // 添加曝光状态筛选
    if (query.exposure !== undefined) {
      queryBuilder.andWhere('xyBook.exposure = :exposure', {
        exposure: query.exposure,
      });
    }

    // 添加排序
    queryBuilder.orderBy(`xyBook.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');

    // 获取总数
    const total = await queryBuilder.getCount();

    // 获取分页数据
    const items = await queryBuilder.skip(skip).take(limit).getMany();

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
      relations: ['bookData'] // 加载关联的书籍数据
    });
    if (!book) {
      throw new NotFoundException(`闲鱼书籍ID ${id} 不存在`);
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
    const book = await this.findOne(id);
    Object.assign(book, updateXyBookDto);
    return await this.xyBookRepository.save(book);
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
} 