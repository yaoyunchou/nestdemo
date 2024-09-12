/**
 * 
 * https://www.goofish.pro/open/doc
 * "order_no": "4025500203829613123",
 *  "order_status": 22,
 * 11 : 待付款
 * 12 : 待发货
 * 21 : 已发货
 * 22 : 交易成功
 * 23 : 已退款
 * 24 : 交易关闭
 *  "refund_status": 0,
 *  "user_name": "tb133799136652",
 *  "modify_time": 1725973639,
 *  "order_type": 1,
 *  "seller_id": 604948187840581
 */


import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
export class XYOrderDto {

    // order_no 定义订单
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    order_no: string;


    // 订单状态
    @IsNumber()
    @ApiProperty()
    order_status: number;

    // 店铺名称， 本系统大部分使用shopName  闲鱼使用user_name
    @IsString()
    @ApiProperty()
    user_name: string; // 店铺名称，

    // 书名
    @IsOptional() // 退款状态
    @ApiProperty({ required: false })
    refund_status?: string;

    // 订单更新时间
    @IsNumber()
    @ApiProperty({ required: false })
    modify_time?: number;
}
