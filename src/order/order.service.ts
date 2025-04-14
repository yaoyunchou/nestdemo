import { Injectable } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';

import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import * as _ from 'lodash';
import { FeiShuService } from './fsService';

@Injectable()
export class OrderService {
  constructor(@InjectRepository(Order) private readonly orderRepository: Repository<Order>, private readonly feiShuService: FeiShuService) {
    
  }
  create(createOrderDto: CreateOrderDto) {
    const entity = this.orderRepository.create(createOrderDto);
    return this.orderRepository.save(entity);
  }

  async findAll(query:any) {
    console.log('query----------------', query)
    const newQuery = _.omit(query, ['page', 'pageSize'])
    const queryBuilder =  this.orderRepository.createQueryBuilder("order"); // "order" 是实体别名
    Object.keys(newQuery).forEach(key => {
      queryBuilder.andWhere(`order.${key} = :${key}`, newQuery);
    });
   
    // 计算满足筛选条件的记录总数
    const count = await queryBuilder.getCount();
    // 应用分页
    const queryPage = Number(query.page) || 1;
    const queryPageSize = Number(query.pageSize) || 10;
    queryBuilder.skip((queryPage - 1) * queryPageSize).take(queryPageSize);
    // 使用leftJoinAndSelect来加载关联的images
    queryBuilder.leftJoinAndSelect("order.orderGood", "orderGood")
    .orderBy("order.updatedAt", "DESC")
     // 获取当前页的书籍
    const orderList = await queryBuilder.getMany();
    return {
      total: count,
      list:orderList
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} order444`;
  }

  async findOrderByOrderNo(order_no: string) {
    // 根据order_no 查询订单, goods_id 
    const order =  await this.orderRepository.createQueryBuilder("order")
    .where("order.order_no = :order_no", { order_no })
    .leftJoinAndSelect("order.orderGood", "orderGood")
    .getOne();
    console.log('order----------------', order)
    return order
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order =  await this.orderRepository.findOne({where:{id: id}})
    const tempOrder = _.merge(order, updateOrderDto)
    const entity = this.orderRepository.create(tempOrder);
    const result = this.orderRepository.save(entity)
    return result
  }
  remove(id: number) {
    return this.orderRepository.delete(id);
  }
}
