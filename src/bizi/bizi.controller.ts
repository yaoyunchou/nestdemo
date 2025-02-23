import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { BiziService } from './bizi.service';
import { CreateBiziDto } from './dto/create-bizi.dto';
import { UpdateBiziDto } from './dto/update-bizi.dto';
import { responseWarp } from 'src/utils/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('bizi')
@ApiTags('bizi')
export class BiziController {
  constructor(private readonly biziService: BiziService) {}

  @Post()
  @ApiOperation({ summary: '上传壁纸', operationId: 'createBizi'   })
  @ApiBody({ type: CreateBiziDto })
  @ApiResponse({ status: 201, description: '上传成功' })
  create(@Body() createBiziDto: CreateBiziDto) {
    return this.biziService.create(createBiziDto);
  }

  @Get()
  @ApiOperation({ summary: '获取壁纸列表', operationId: 'findAllBizi' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findAll(@Query() query: any) {
    if(query?.id){
      query.id = +query.id;
    }
    const bookDataInfo = await this.biziService.findAll(query);
    return  responseWarp({list: bookDataInfo.books, total: bookDataInfo.total, page: query.page|| 1, pageSize: query.pageSize ||10});
  }

  @Get(':id')
  @ApiOperation({ summary: '获取壁纸详情', operationId: 'findOneBizi' })
  async findOne(@Param('id') id: string) {
    const data = await this.biziService.findOneById(+id);
    if(!data) {
      return responseWarp(null, 400, '数据不存在');
    }else{
      return responseWarp(data);
    }
  }
  @Get('/query/:key')
  @ApiOperation({ summary: '获取壁纸详情', operationId: 'findOneBizi' })
  async findOneByShopId(@Param('key') key: string, @Query('value') value: string) {
    const data = await this.biziService.findOneByKey(key, value);
    if(!data) {
      return responseWarp(null, 400, '数据不存在');
    }else{
      return responseWarp(data);
    }
  }


  @Patch(':id')
  @ApiOperation({ summary: '更新壁纸', operationId: 'updateBizi' })
  update(@Param('id') id: string, @Body() updateBiziDto: UpdateBiziDto) {
    return this.biziService.update(+id, updateBiziDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除壁纸', operationId: 'deleteBizi' })
  async remove(@Param('id') id: string) {
    const result = await	 this.biziService.remove(+id);
    return responseWarp(result, 0, '删除成功');
  }
}
