import { NestFactory } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { XyBook } from './entities/xyBook.entity';
import { XyBookData } from './entities/xyBookData.entity';
import { XyShop } from '../xyShop/entities/xyShop.entity';
import { XyBookImportService } from './xyBook.import.service';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';

// 创建一个只包含必要模块的轻量级模块
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => dotenv.config()],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [XyBook, XyBookData, XyShop],
      synchronize: process.env.DB_SYNC === 'true',
    }),
    TypeOrmModule.forFeature([XyBook, XyBookData, XyShop]),
  ],
  providers: [XyBookImportService],
})
class ImportModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(ImportModule);
  const importService = app.get(XyBookImportService);

  try {
    // 获取命令行参数
    const filePath = process.argv[2];

    console.log('开始导入数据...');
    const result = await importService.importFromFile(filePath);
    
    console.log('导入完成:');
    console.log(`成功导入: ${result.success} 条`);
    console.log(`失败: ${result.errors} 条`);
  } catch (error) {
    console.error('导入失败:', error.message);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap(); 