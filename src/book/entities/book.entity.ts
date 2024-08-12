import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BookView } from "./book.view.entity";

import { Image } from "./image.entity";
import { Shop } from "src/shop/entities/shop.entity";

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
    firstCategory: string;  // 书籍的第一级分类

    @Column({default: ''})
    secondCategory: string;  // 书籍的第二级分类


    @UpdateDateColumn() // 更新时间
    updatedAt: Date;

    @OneToMany(() => BookView, bookView => bookView.book)
    bookViews: BookView[];

    @OneToMany(() => Image, image => image.book, { cascade: true })
    images: Image[];

    @ManyToMany(() => Shop, shop => shop.books,  { cascade: true })
    @JoinTable({ name: 'books_shops' })
    shops: Shop[]
}
