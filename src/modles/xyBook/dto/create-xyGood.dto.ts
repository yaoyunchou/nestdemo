import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateXyGoodDto {

  @ApiProperty({ description: '店铺ID',required: false})
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiProperty({ description: '店铺用户名', required: false })
  @IsString()
  @IsOptional()
  user_name?: string;

  @ApiProperty({ description: '商品ID'})
  @IsNumber()
  @IsOptional()
  item_id?: number;

  @ApiProperty({ description: '省份编码', required: false })
  @IsNumber()
  @IsOptional()
  province?: number;

  @ApiProperty({ description: '城市编码', required: false })
  @IsNumber()
  @IsOptional()
  city?: number;

  @ApiProperty({ description: '区域编码', required: false })
  @IsNumber()
  @IsOptional()
  district?: number;

  @ApiProperty({ description: '商品标题', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: '商品详情', required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ description: '商品图片列表', type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({ description: '商品状态', example: 1, default: 1, required: false })
  @IsNumber()
  @IsOptional()
  status?: number;

  @ApiProperty({ description: '白底图', required: false })
  @IsString()
  @IsOptional()
  white_images?: string;

  @ApiProperty({ description: '服务支持', required: false })
  @IsString()
  @IsOptional()
  service_support?: string;
}
