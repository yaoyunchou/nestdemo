import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { XyShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('shop')
@ApiTags('shop')
export class ShopController {
  constructor(private readonly shopService: XyShopService) {}

  @Post()
  @ApiOperation({ summary: '创建店铺', operationId: 'createShop' })
  @ApiBody({ type: CreateShopDto })
  @ApiResponse({ status: 201, description: '创建成功' })
  create(@Body() createShopDto: CreateShopDto) {
    return this.shopService.create(createShopDto);
  }

  @Get()
  @ApiOperation({ summary: '获取店铺列表', operationId: 'findAllShop' })  
  @ApiResponse({ status: 200, description: '获取成功' })
  findAll() {
    return this.shopService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取店铺详情', operationId: 'findOneShop' })
  findOne(@Param('id') id: string) {
    return this.shopService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新店铺', operationId: 'updateShop' }) 
  update(@Param('id') id: string, @Body() updateShopDto: UpdateShopDto) {
    return this.shopService.update(+id, updateShopDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除店铺', operationId: 'deleteShop' })
  remove(@Param('id') id: string) {
    return this.shopService.remove(+id);
  }
}
