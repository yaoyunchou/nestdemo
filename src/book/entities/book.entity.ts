import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BookView } from "./book.view.entity";

import { Image } from "./image.entity";
import { XyShop } from "src/shop/entities/xyShop.entity";
import { ApiProperty } from "@nestjs/swagger";

/**
 * 1. 书籍实体
 * 
 */
@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;  // 主键
    
    @Column({default:''})  // 书籍id  
    productId: string;
    
    @Column("text",  { nullable: true })
    description: string;  // 书籍描述

    @Column("text",  { nullable: true })
    content: string;  // 书籍詳情

    @Column("text", { nullable: true })
    title: string;  // 书籍标题

    @Column({default: ''})
    author: string;  // 作者

    @Column({default: 0})
    price: number;  // 价格

    @Column({default: ''})
    publisher: string;  // 出版社
    
    @Column({default: ''})
    isbn: string;  // ISBN
    
    @Column({default: ''})
    @ApiProperty({ description: '书籍的第一级分类' })
    firstCategory: string;  // 书籍的第一级分类

    @Column({default: ''})
    @ApiProperty({ description: '书籍的第二级分类' })
    secondCategory: string;  // 书籍的第二级分类

    @Column({default: 'kw'})  // 数据来源， 默认为kw， 可选值为other、xy、 kw  xy代表闲鱼，kw代表孔夫子网
    @ApiProperty({ description: '数据来源', enum: ['other', 'xy', 'kw'] })
    source: string;  // 数据来源

    @Column({default: ''}) // 如果是xy则有原始数据url，所以只有当source为xy时才有值
    @ApiProperty({ description: '原始数据url', required: false })
    xyOriginalUrl: string;

    @Column({ type: 'simple-array', nullable: true }) // 闲鱼图片，是一个url的数组
    @ApiProperty({ description: '闲鱼图片', type: [String] })
    xyImage: string[];


    @UpdateDateColumn() // 更新时间
    updatedAt: Date;

    @OneToMany(() => BookView, bookView => bookView.book)
    bookViews: BookView[];

    @OneToMany(() => Image, image => image.book, { cascade: true })
    images: Image[];

    

    @ManyToMany(() => XyShop, xyShop => xyShop.books,  { cascade: true })
    @JoinTable({ name: 'books_xyShops' })
    xyShops: XyShop[]
}
