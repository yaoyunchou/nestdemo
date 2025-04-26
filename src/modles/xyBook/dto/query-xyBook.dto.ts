import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export class QueryXyBookDto {
  @ApiProperty({ required: false, description: '搜索关键词（标题或ISBN）' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, description: '产品状态' })
  @IsOptional()
  @IsString()
  product_status?: string;

  @ApiProperty({ required: false, description: '店铺名称' })
  @IsOptional()
  @IsString()
  shopName?: string;

  @ApiProperty({ required: false, description: 'ISBN' })
  @IsOptional()
  @IsString()
  ISBN?: string;

  @ApiProperty({ required: true, description: '页码', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: true, description: '每页数量', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize?: number = 10;

  @ApiProperty({ required: false, description: '排序字段', default: 'createAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createAt';

  @ApiProperty({ 
    required: false, 
    description: '排序方向', 
    enum: SortOrder,
    default: SortOrder.DESC,
    example: SortOrder.DESC
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
} 