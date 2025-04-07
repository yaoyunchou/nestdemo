import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBookViewDto {

    // 书籍id  必须传入， 作为关连建
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    productId: string;

    // 曝光量
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    exposure: number;

    // 浏览量
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    views: number;

    //想要
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    wants: number;


    // 创建时间
    @IsString()
    @IsOptional()
    @ApiProperty()
    createTimestamp: string;

}
