import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { XyBook } from './entities/xyBook.entity';
import { XyBookData } from './entities/xyBookData.entity';
import { XyShop } from '../xyShop/entities/xyShop.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class XyBookImportService {
  private readonly logger = new Logger(XyBookImportService.name);

  constructor(
    @InjectRepository(XyBook)
    private readonly xyBookRepository: Repository<XyBook>,
    @InjectRepository(XyBookData)
    private readonly bookDataRepository: Repository<XyBookData>,
    @InjectRepository(XyShop)
    private readonly xyShopRepository: Repository<XyShop>,
  ) {}

  /**
   * 从JSON文件导入数据
   * @param filePath JSON文件路径
   */
  async importFromFile(filePath?: string): Promise<{ success: number; errors: number }> {
    if (!filePath) {
      const rootDir = process.cwd();
      filePath = path.resolve(rootDir, 'src/modles/xyBook/data.json');
    }

    if (!fs.existsSync(filePath)) {
      throw new Error(`文件不存在: ${filePath}`);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);

    if (!Array.isArray(data)) {
      throw new Error('无效的数据格式: 期望是一个数组');
    }

    let successCount = 0;
    let errorCount = 0;

    // 第一步：收集所有唯一的 ISBN
    const uniqueIsbns = new Set<string>();
    for (const item of data) {
      if (item.isbn) {
        uniqueIsbns.add(item.isbn);
      }
    }

    // 第二步：批量创建或更新 book_data 记录
    for (const isbn of uniqueIsbns) {
      try {
        const bookData = new XyBookData();
        bookData.isbn = isbn;
        // 找到第一个包含这个 ISBN 的项来获取书籍信息
        const firstItem = data.find(item => item.isbn === isbn);
        if (firstItem) {
          bookData.title = firstItem.title || '';
          bookData.author = firstItem.book_data?.author || '';
          bookData.publisher = firstItem.book_data?.publisher || '';
        }
        await this.bookDataRepository.save(bookData);
        this.logger.log(`成功创建/更新书籍数据: ${isbn}`);
      } catch (error) {
        this.logger.error(`创建/更新书籍数据失败 (ISBN: ${isbn}): ${error.message}`);
        errorCount++;
      }
    }

    // 第三步：导入 xy_books 记录
    for (const item of data) {
      try {
        const book = new XyBook();
        book._id = item._id || this.generateId();
        book.product_id = item.product_id || 0;
        book.title = item.title || '';
        book.isbn = item.isbn || '';
        book.content = item.content || '';
        book.exposure = item.exposure || 0;
        book.views = item.views || 0;
        book.wants = item.wants || 0;
        book.price = item.price || 0;
        book.product_status = item.product_status || 0;
        book.statusText = item.statusText || '';
        book.shopName = item.shopName || '';
        book.shopID = item.shopID || '';

        // 时间戳处理
        if (item.createAt) {
          book.createAt = new Date(item.createAt);
        }
        if (item.updateAt) {
          book.updateAt = new Date(item.updateAt);
        }

        // 这里还需要处理publish_shops 数据， 在导入数据的时候也要跟着导入
        if(item?.publish_shop){
          book.publish_shop =  item.publish_shop || []
        }

        await this.xyBookRepository.save(book);
        successCount++;
        this.logger.log(`成功导入闲鱼书籍: ${book._id}`);
      } catch (error) {
        this.logger.error(`导入项目失败: ${error.message}`);
        errorCount++;
      }
    }

    return {
      success: successCount,
      errors: errorCount
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
} 