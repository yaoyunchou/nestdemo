import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { BZImage } from "./bzImage.entity";
import { XyShop } from "src/shop/entities/xyShop.entity";

/**
 * 1. 书籍实体
 * 
 */
@Entity()
export class Bizi {
    @PrimaryGeneratedColumn()
    id: number;  // 主键
    
    @Column({default:''})  // 对应的店铺
    shopId: string;
    
    @Column("text",  { nullable: true })
    name: string;  // 名字

    @Column("text",  { nullable: true })
    other: string;  // 扩展字段

    @Column("text",  { nullable: true })
    url: string;  // 获取数据的url

    @Column("text",  { nullable: true })
    content: string;  // 获取数据的url

    @Column("text",  { nullable: true })
    downloadUrl: string[];  // 获取数据的url

    @Column("text",  { nullable: true })
    downloadZipUrl: string;  // 打包文件地址


    @UpdateDateColumn() // 更新时间
    updatedAt: Date;

  
    @OneToMany(() => BZImage, image => image.bizi, { cascade: true, })
    images: BZImage[];

    @ManyToMany(() => XyShop, xyShop => xyShop.books,  { cascade: true })
    @JoinTable({ name: 'bizi_xyShops' })
    xyShops: XyShop[]
}
