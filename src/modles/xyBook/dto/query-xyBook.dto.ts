import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryXyBookDto {
  @ApiProperty({ required: false, description: 'Search by title or ISBN' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, description: 'Filter by product status' })
  @IsOptional()
  @IsString()
  product_status?: string;

  @ApiProperty({ required: false, description: 'Filter by shop ID' })
  @IsOptional()
  @IsString()
  shopID?: string;

  @ApiProperty({ required: false, description: 'Filter by exposure status' })
  @IsOptional()
  @IsString()
  exposure?: string;

  @ApiProperty({ required: false, description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, description: 'Items per page', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({ required: false, description: 'Sort field', default: 'createAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createAt';

  @ApiProperty({ required: false, description: 'Sort order', enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
} 