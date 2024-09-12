import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, isObject } from "class-validator";
import { OrderGood } from "../entities/order.good.entity";
export class CreateOrderDto {

    // order_no 定义订单
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    order_no: string;


    // 订单状态
    @IsNumber()
    @IsOptional() // 非必填
    @ApiProperty()
    order_status: number;

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

    orderGood: OrderGood
  

}
