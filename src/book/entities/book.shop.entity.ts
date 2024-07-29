import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Book } from "./book.entity";

@Entity()
export class Shop {
    @PrimaryGeneratedColumn()
    id: number;  // 主键
    
    @Column()  // 店铺名称 
    name: string;
    
    @Column()
    shopName: string;  // 闲鱼会员名

    @CreateDateColumn() // 创建时间
    createdAt: Date;

    @UpdateDateColumn() // 更新时间
    updatedAt: Date;

    @ManyToMany(() => Book, book => book.shops)
    books: Book[]
}
