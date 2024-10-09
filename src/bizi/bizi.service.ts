import { Injectable } from '@nestjs/common';
import { UpdateBiziDto } from './dto/update-bizi.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bizi } from './entities/bizi.entity';
import { Repository } from 'typeorm';
import { XyShop } from 'src/shop/entities/xyShop.entity';
import { BZImage } from './entities/bzImage.entity';
import * as _ from 'lodash';

@Injectable()
export class BiziService {
  constructor(
    @InjectRepository(Bizi) private biziRepository: Repository<Bizi>,
    @InjectRepository(XyShop) private readonly xyShopRepository: Repository<XyShop>,
    @InjectRepository(BZImage) private readonly bzImageRepository: Repository<BZImage>
  ) {}
  async create(createBiziDto: any) {
    const checkData = null 
    // await this.biziRepository.findOne({ where: {shopId: createBiziDto.shopId}});
    console.log(checkData)

    if(checkData) {
      const result =  await this.update(checkData.id, createBiziDto);
      console.log('result----------------', result)
      return {
        data: checkData,
        msg: '数据已存在，已更新',
      };
    }else {
      const result = await this.biziRepository.create(createBiziDto);
      const createBookInfo = await this.biziRepository.save(result);
      return {
        data: createBookInfo,
        msg: '新增数据成功',
      }; ;
    }
   
  }
  async findAll(query) {
    console.log('query----------------', query)
    const newQuery = _.omit(query, ['page', 'pageSize'])
    // const whereParams =  Object.keys(newQuery).map(key => {
    //   return { [key]: newQuery[key] }
    // })
    // console.log('listResult----------------', whereParams)
    // const total = this.biziRepository.find({
    //   where: whereParams.length? whereParams : {}}).getCount();
    // const bookList = this.biziRepository.find({
    //   where: whereParams.length? whereParams : {},
     
    //   take: query?.pageSize|| 10,
    //   skip: ((query.page || 1) - 1) * (query.pageSize || 10),
    
    // });
    const queryBuilder =  this.biziRepository.createQueryBuilder("bizi"); // "Bizi" 是实体别名
    Object.keys(newQuery).forEach(key => {
      queryBuilder.andWhere(`bizi.${key} = :${key}`, newQuery);
    });
   
    // 计算满足筛选条件的记录总数
    const count = await queryBuilder.getCount();
    // 应用分页
    const queryPage = Number(query.page) || 1;
    const queryPageSize = Number(query.pageSize) || 10;
    queryBuilder.skip((queryPage - 1) * queryPageSize).take(queryPageSize);
    // 使用leftJoinAndSelect来加载关联的images
    queryBuilder.leftJoinAndSelect("bizi.images", "image")
    .leftJoinAndSelect("bizi.xyShops", "xyShop")
    .orderBy("bizi.updatedAt", "DESC")
     // 获取当前页的书籍
    const books = await queryBuilder.getMany();
    return {
      total: count,
      books
    };
  }
  async findOneById(id: number) {
    const item = await this.biziRepository.findOne({where: {id},relations: ['xyShops', 'images']});
    return item;
  }
  async findOneByKey(key:string, value:string) {
    const queryBuilder =  this.biziRepository.createQueryBuilder("bizi"); // "Bizi" 是实体别名
    const str = `bizi.${key} = :${key}`;
    // const str = `bizi.shopId = :shopId`;
    queryBuilder.andWhere(str, {[key]:value});
    // queryBuilder.andWhere(`bizi.shopId = :shopId`, {shopId: "60"});
    const item = await queryBuilder.getOne();
    return item;
  }
  findOne(id: number) {
    return `This action returns a #${id} bizi`;
  }

  update(id: number, updateBiziDto: UpdateBiziDto) {
    return this.biziRepository.update(id, updateBiziDto);
  }

  remove(id: number) {
    // return this.biziRepository.delete(id);

    const imageQueryBuilder =  this.biziRepository.createQueryBuilder("bzImage"); // "Bizi" 是实体别名
    imageQueryBuilder.delete().from(BZImage).where("biziId = :biziId", { biziId: id }).execute();

    const queryBuilder =  this.biziRepository.createQueryBuilder("bizi"); // "Bizi" 是实体别名
    const result =  queryBuilder.delete().from(Bizi).where("id = :id", { id }).execute();
    return result
  }
}
