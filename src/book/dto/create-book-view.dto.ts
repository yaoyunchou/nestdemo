import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBookViewDto {

    // 书籍id  必须传入， 作为关连建
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    bookId: string;

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
    @IsNotEmpty()
    @ApiProperty()
    createTimestamp: string;

}
