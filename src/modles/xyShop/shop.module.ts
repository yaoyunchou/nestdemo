import { Module } from '@nestjs/common';
import { XyShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { XyShop } from './entities/xyShop.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([XyShop])],
  controllers: [ShopController],
  providers: [XyShopService]
})
export class ShopModule {}
