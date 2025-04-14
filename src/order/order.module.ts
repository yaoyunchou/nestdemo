import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderGood } from './entities/order.good.entity';
import { Order } from './entities/order.entity';
import { XyShopService } from 'src/shop/shop.service';
import { XYAPIService } from './xyService';
import { XyShop } from 'src/shop/entities/xyShop.entity';
import { FeiShuService } from './fsService';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderGood, XyShop])],
  controllers: [OrderController],
  providers: [OrderService, XyShopService, XYAPIService, FeiShuService]
})
export class OrderModule {}
