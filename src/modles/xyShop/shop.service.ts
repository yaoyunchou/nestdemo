import { Injectable } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { XyShop } from './entities/xyShop.entity';

@Injectable()
export class XyShopService {
  constructor( @InjectRepository(XyShop) private readonly xyShopRepository: Repository<XyShop>) {
   
  }
  create(createShopDto: CreateShopDto) {
    return 'This action adds a new shop';
  }

  findAll() {
    return `This action returns all shop`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shop`;
  }
  async findOneQuery(query: Partial<CreateShopDto>) {
    const shop = await this.xyShopRepository.findOne({where: query});
    return  shop;
  }
  update(id: number, updateShopDto: UpdateShopDto) {
    return `This action updates a #${id} shop`;
  }

  remove(id: number) {
    return `This action removes a #${id} shop`;
  }
}
