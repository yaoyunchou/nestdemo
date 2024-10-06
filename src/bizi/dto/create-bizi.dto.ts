import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, isObject } from "class-validator";
import { BZImage } from "../entities/bzImage.entity";
import { CreateImageDto } from "src/book/dto/create-image.dto";
export class CreateBiziDto {
    // isbn
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsString()
    @IsOptional() // 非必填
    @ApiProperty()
    url: string; // 书籍的第一级分类

    @IsString()
    @IsOptional() // 非必填
    @ApiProperty()
    other: string; // 其他属性

    // 必填
    @IsString()
    @IsOptional() // 非必填
    @ApiProperty()
    downloadUrl: string[]; // 书籍的第二级分类

    // 书名
    @IsArray()
    @IsOptional() // 非必填
    @ApiProperty({ required: false })
    downloadZipUrl?: string;

    // 描述
    @IsString()
    @IsOptional() // 非必填
    @ApiProperty({ required: false })
    content?: string;


    // 作者
    @IsString()
    @IsOptional() // 非必填
    @ApiProperty({ required: false })
    shopId?: string;

     // 作者
     @IsString()
     @IsOptional() // 非必填
     @ApiProperty({ required: false })
     biziId?: string;  // 用于查找壁纸项目

     @IsString()
     @IsOptional() // 非必填
     @ApiProperty({ required: false })
     type?: string;  // 类型

    // 作者
    @IsString()
    @IsOptional() // 非必填
    @ApiProperty({ required: false })
    channel?: string;  // 渠道
    
    // 作者
    @IsArray()
    @IsOptional() // 非必填
    @ApiProperty({ required: false })
    images?: CreateImageDto[];

        // 店铺
    @IsArray()
    @IsOptional() // 非必填
    @ApiProperty({ required: false })
    xyShops: {shopName?:string, name?:string}[];
}
