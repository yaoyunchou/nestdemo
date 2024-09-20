import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BiziService } from './bizi.service';
import { CreateBiziDto } from './dto/create-bizi.dto';

import { UpdateBiziDto } from './dto/update-bizi.dto';
import { responseWarp } from 'src/utils/common';

@Controller('bizi')
export class BiziController {
  constructor(private readonly biziService: BiziService) {}

  @Post()
  create(@Body() createBiziDto: CreateBiziDto) {
    return this.biziService.create(createBiziDto);
  }

  @Get()
  async findAll(@Query() query: any) {
    if(query?.id){
      query.id = +query.id;
    }
    const bookDataInfo = await this.biziService.findAll(query);
    return  responseWarp({list: bookDataInfo.books, total: bookDataInfo.total, page: query.page|| 1, pageSize: query.pageSize ||10});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.biziService.findOneById(+id);
    if(!data) {
      return responseWarp(null, 400, '数据不存在');
    }else{
      return responseWarp(data);
    }
  }
  @Get('/query/:key')
  async findOneByShopId(@Param('key') key: string, @Query('value') value: string) {
    const data = await this.biziService.findOneByKey(key, value);
    if(!data) {
      return responseWarp(null, 400, '数据不存在');
    }else{
      return responseWarp(data);
    }
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBiziDto: UpdateBiziDto) {
    return this.biziService.update(+id, updateBiziDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.biziService.remove(+id);
  }
}
