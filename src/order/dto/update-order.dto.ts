import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, isObject } from "class-validator";
import { CreateOrderDto } from './create-order.dto';


export class UpdateOrderDto extends PartialType(CreateOrderDto) {


    // 店铺名称， 本系统大部分使用shopName  闲鱼使用user_name
    @IsString()
    @IsOptional() // 非必填
    @ApiProperty()
    user_name: string; // 店铺名称，

    // 书名
    @IsOptional() // 非必填
    @ApiProperty({ required: false })
    title?: string;

    // 描述
    @IsString()
    @IsOptional() // 非必填
    @ApiProperty({ required: false })
    modify_time?: number;

}
