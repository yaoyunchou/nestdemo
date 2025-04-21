import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import {  XyBook } from "../../xyBook/entities/xyBook.entity";


/**
 *  1. 店铺实体
 *  2 店铺的商品情况情况
 *  会标记当前店铺的商品情况的情况如上架下架， 价格， 
 * 
 */

@Entity()
export class XyShop {
    @PrimaryGeneratedColumn()
    id: number;  // 主键
    
    @Column()  // 店铺名称 
    name: string;

    @Column()  // 应用key 
    appKey: string;

    @Column()  // 应用密钥 
    appSecret: string;
    
    @Column()
    shopName: string;  // 闲鱼会员名

    @CreateDateColumn() // 创建时间
    createdAt: Date;

    @UpdateDateColumn() // 更新时间
    updatedAt: Date;


    @ManyToMany(() => XyBook, book => book.shops)
    books: XyBook[]
}
