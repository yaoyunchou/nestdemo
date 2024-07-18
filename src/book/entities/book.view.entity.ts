import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class BookView {
    @PrimaryGeneratedColumn()
    id: number;  // 主键
    
    @Column()  // 书籍id  
    productId: string;
    
    @Column()
    exposure: number;  // 曝光量

    @Column()
    views: number;  // 浏览量

    @Column()
    wants: number;  // 想读量

    @Column()
    createTimestamp: string// 收集的时间

    @CreateDateColumn() // 创建时间
    createdAt: Date;

    @UpdateDateColumn() // 更新时间
    updatedAt: Date;
}
