import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class QueryXyOneBookDto {
  @ApiProperty({ description: '搜索关键词（模糊查询标题或ISBN）', required: false })
  @IsString()
  @IsOptional()
  search?: string;


  @ApiProperty({ description: '店铺名称（精确查询）', required: false })
  @IsString()
  @IsOptional()
  shopName?: string;

  @ApiProperty({ description: '书籍标题（精确查询）', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  //product_id

  @ApiProperty({ description : '产品ID', required: false})
  @IsString()
  @IsOptional()
  product_id?: string

  

  @ApiProperty({ description: 'ISBN（精确查询）', required: false })
  @IsString()
  @IsOptional()
  ISBN?: string;
}
