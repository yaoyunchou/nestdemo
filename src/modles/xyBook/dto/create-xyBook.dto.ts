import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { XyShop } from "../../xyShop/entities/xyShop.entity";
import { CreateXyGoodDto } from './create-xyGood.dto';


class BookDataDto {
  @ApiProperty()
  @IsString()
  isbn: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  publisher: string;

  @ApiProperty()
  @IsString()
  author: string;
}


export class CreateXyBookDto {
  @ApiProperty()
  @IsString()
  _id: string;

  @ApiProperty()
  @IsNumber()
  product_id: number;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  isbn: string;


  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => BookDataDto)
  book_data: BookDataDto;

  @ApiProperty({ description: '商品信息列表' })
  @IsArray()
  @Type(() => CreateXyGoodDto)
  publish_shop: CreateXyGoodDto[];

  @ApiProperty({ required: false, default: 0 })
  @IsNumber()
  @IsOptional()
  exposure?: number;

  @ApiProperty({ required: false, default: 0 })
  @IsNumber()
  @IsOptional()
  views?: number;

  @ApiProperty({ required: false, default: 0 })
  @IsNumber()
  @IsOptional()
  wants?: number;

  @ApiProperty({ type: [XyShop] })
  @ValidateNested({ each: true })
  @Type(() => XyShop)
  shops: XyShop[];

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  product_status: number;

  @ApiProperty()
  @IsString()
  statusText: string;

  @ApiProperty()
  @IsString()
  shopName: string;
} 