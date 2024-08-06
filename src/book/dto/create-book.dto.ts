import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, isObject } from "class-validator";
import { CreateImageDto } from "./create-image.dto";
import { Type } from "class-transformer";
export class CreateBookDto {

    // isbn
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    isbn: string;


    // 书籍的第一级分类必填
    @IsString()
    @IsOptional() // 非必填
    @ApiProperty()
    firstCategory: string; // 书籍的第一级分类

    // 必填
    @IsString()
    @IsOptional() // 非必填
    @ApiProperty()
    secondCategory: string; // 书籍的第二级分类

    // 书名
    @IsOptional() // 非必填
    @ApiProperty({ required: false })
    title?: string;

    // 描述
    @IsString()
    @IsOptional() // 非必填
    @ApiProperty({ required: false })
    content?: string;

    // 价格
    @IsNumber()
    @IsOptional() // 非必填
    @ApiProperty({ required: false })
    price?: number;


    // 作者
    @IsString()
    @IsOptional() // 非必填
    @ApiProperty({ required: false })
    author?: string;

    // 出版社
    @IsString()
    @IsOptional() // 非必填
    @ApiProperty({ required: false })
    publisher?: string;


    // 图片
    @IsArray()
    @IsOptional() // 非必填
    @ApiProperty({ required: false })
    @Type(() => CreateImageDto) // 使用Type来指定数组中元素的类型
    images: CreateImageDto[];


}
