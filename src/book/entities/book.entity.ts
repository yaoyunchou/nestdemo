import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BookView } from "./book.view.entity";
import { Shop } from "./book.shop.entity";
import { Image } from "./image.entity";

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
    publish: string;  // 出版社
    
    @Column({default: ''})
    isbn: string;  // ISBN


    @UpdateDateColumn() // 更新时间
    updatedAt: Date;

    @OneToMany(() => BookView, bookView => bookView.book)
    bookViews: BookView[];

    @OneToMany(() => Image, image => image.book, { cascade: ['insert'] })
    images: Image[];

    @ManyToMany(() => Shop, shop => shop.books)
    @JoinTable({ name: 'shops_books' })
    shops: Shop[]
}
