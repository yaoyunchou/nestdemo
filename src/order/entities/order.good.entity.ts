/**
 * 每个订单都有一个当前的订单价格，   后面可能会改价格， 
 * 这里就是一对一的保存当前商品的实际价格
 */

import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class OrderGood {
    @PrimaryGeneratedColumn()
    id: number;  // 主键
    
    // 商品名称
    @Column({default: ''})
    title: string;

    // 订单的状态
    @Column({default: 0})
    price: number;

    // 商品原始id
    @Column({default: ''})
    goodID: string;

    @Column({default: ''})
    author: string;  // 作者

    @Column({default: ''})
    publisher: string;  // 出版社
    
    @Column({default: ''})
    isbn: string;  // ISBN

    @OneToOne(() => Order, (order) => order.orderGood,)
    order: Order;
}





