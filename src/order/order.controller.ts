import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { XYAPIService } from './xyService';
import { responseWarp } from 'src/utils/common';
import { Order } from './entities/order.entity';
import * as _ from 'lodash';
import { XYOrderDto } from './dto/xy-order.dto copy';
import { OrderGood } from './entities/order.good.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService,
    private readonly xyAPIService: XYAPIService){}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll(@Query() query) {
    return this.orderService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
  // 闲鱼相关接口
  @Get('/xy/detail') 
  async xyDetail(@Query() query: {order_no: string, shopName: string}) {
    // 获取订单信息
    const order = await this.xyAPIService.xyRequest<Order>('/api/open/order/detail', {shopName: query.shopName, order_no:query.order_no});
    if(order?.code === 0) {
      const  product_id = _.get(order?.data, 'goods.product_id');
      const book = await this.xyAPIService.xyRequest('/api/open/product/detail', {product_id});
       // 通过订单的商品信息  获取isbn
      if(book?.code === 0) {
        console.log(' -- result--', book);
        const bookData = _.get(book?.data, 'book_data');
        return  responseWarp({...order.data, bookData}, 0, book?.msg);
      }
      
    }
    return responseWarp(null, 1, '获取数据失败');
  }

  // 闲鱼订单列表
  @Get('/xy/list') 
  async xyOrderList(@Query() query: {shopName: string, order_status?: string, pageSize?: number, pageIndex?: number}) {
    const result = await this.xyAPIService.xyRequest<Order>('/api/open/order/list', {"page_size": +query?.pageSize || 10,
    "page_no": +query?.pageIndex || 1,
    "order_status": query.order_status || null,}, 'POST');
    console.log(' -- result--', result);
    return responseWarp(result?.data, 0, result?.msg);
  }
  // 闲鱼订单订阅
  @Post('/xy/subscription')
  async xyOrderSubscription(@Body() body: XYOrderDto & {shopName?: string}) {
    const shopName = body?.shopName || body?.user_name
    try { 
      // 根据订单号，查询订单
      const orderDetail = await this.orderService.findOrderByOrderNo(body.order_no);
      // const result = await this.xyAPIService.xyRequest('/api/open/order/status');
      // 判断是否有orderDetail， 如果没有则进行新增
      if(orderDetail){
        const newOrder = _.merge(orderDetail, body)
        const result = await this.orderService.update(orderDetail.id, newOrder)
        console.log(' -- result--', result);
        return responseWarp(result, 0, '');
      }else{

        // 通过order_no 获取订单详情
        const orderResult = await this.xyAPIService.xyRequest<any>('/api/open/order/detail', {shopName: shopName, order_no:body.order_no});
        const xyOrder = orderResult.data;

        if(orderResult?.code === 0) {

          const  product_id = _.get(xyOrder, 'goods.product_id');
          const book = await this.xyAPIService.xyRequest('/api/open/product/detail', {product_id});
           // 通过订单的商品信息  获取isbn
          if(book?.code === 0 && _.isObject(xyOrder)) {
            console.log(' -- result--', book);
            const bookData:{} = _.get(book?.data, 'book_data');
            
            const tmpOrder = {
              ...xyOrder, user_name: shopName,  orderGood: {...(xyOrder as Order& {goods: OrderGood}).goods!, ...bookData}}
            console.log('-----------------------------------', tmpOrder)
            
            // 进行数据加工， 保存数据
            const createOrderResult = await this.orderService.create(tmpOrder)
            return  responseWarp(createOrderResult, 0, book?.msg);
          }
          
        }
        

        // console.log(' -- result--', result);
        return responseWarp({}, 1, '同步失败了!');
      }
    } catch (error) {
      console.error(' -- error--', error);
    }
    
  }
}
