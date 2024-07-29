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
    name: string;

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
