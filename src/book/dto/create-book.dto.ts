import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsObject, IsString, isObject } from "class-validator";
import { Image } from "../entities/image.entity";
export class CreateBookDto {

    // isbn
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    isbn: string;

    // 书名
    @IsString()
    @ApiProperty()
    title: string;

    // 描述
    @IsString()
    @ApiProperty()
    content: string;

    // 价格
    @IsNumber()
    @ApiProperty()
    price: number;


    // 作者
    @IsString()
    @ApiProperty()
    author: string;

    // 出版社
    @IsString()
    @ApiProperty()
    publish: string;


    // 图片
    @IsArray()
    @ApiProperty()
    images: Image[];




}
