import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, isObject } from "class-validator";
import { Image } from "../entities/image.entity";
export class CreateBookDto {

    // isbn
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    isbn: string;

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
    publish?: string;


    // 图片
    @IsArray()
    @IsOptional() // 非必填
    @ApiProperty({ required: false })
    images?: Image[];

}
