import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, isObject } from "class-validator";
import { Image } from "../entities/image.entity";
export class CreateImageDto {

    // url
    @IsString()
    @IsOptional() // 非必填
    @ApiProperty()
    url?: string;


    // base64
    @IsString()
    @IsOptional() // 非必填
    @ApiProperty()
    base64?: string;

}
