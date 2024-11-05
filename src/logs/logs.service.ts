/*
 * @Author: yaoyc yaoyunchou@bananain.com
 * @Date: 2024-05-29 11:59:26
 * @LastEditors: yaoyc yaoyunchou@bananain.com
 * @LastEditTime: 2024-11-05 11:05:58
 * @FilePath: \nestjs-lesson\src\logs\logs.service.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logs } from './logs.entity';
import { CreateLogsDto } from './dto/create.dto';
import { Repository } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import * as _ from 'lodash';
@Injectable()
export class LogsService {
    constructor(
        @InjectRepository(Logs) private logsRepository: Repository<Logs>,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: WinstonLogger,
      ) {}
    
      async create(createLogsDto: CreateLogsDto) {
        const log = await this.logsRepository.create(createLogsDto);
        this.logger.log('log created', JSON.stringify(log));
        return this.logsRepository.save(log);
      }
    
      async findAll(query: any) {
        console.log('query----------------', query)
        const newQuery = _.omit(query, ['page', 'pageSize'])
      
        const queryBuilder =  this.logsRepository.createQueryBuilder("logs"); // "book" 是实体别名
        Object.keys(newQuery).forEach(key => {
          queryBuilder.andWhere(`logs.${key} = :${key}`, newQuery);
        });
       
        // 计算满足筛选条件的记录总数
        const count = await queryBuilder.getCount();
        // 应用分页
        const queryPage = Number(query.page) || 1;
        const queryPageSize = Number(query.pageSize) || 10;
        queryBuilder.skip((queryPage - 1) * queryPageSize).take(queryPageSize);
        // 使用leftJoinAndSelect来加载关联的images
        queryBuilder.leftJoinAndSelect("logs.user", "user")
        .select(["logs", "user.username", "user.id"])
        .orderBy("logs.createdAt", "DESC");
         // 获取当前页的书籍
        const logs = await queryBuilder.getMany();
        return {
          total: count,
          list:logs
        };
      }
    
      findOne(id: number) {
        return this.logsRepository.findOne({
          where: {
            id,
          },
        });
      }
}
