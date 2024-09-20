import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Bizi } from "./bizi.entity";

@Entity()
export class BZImage {
    @PrimaryGeneratedColumn()
    id: number;  // 主键
    
    @Column({default:''})  // 图片链接 
    url: string;
    
    @Column({default: ''})
    base64: string;  // 图片的base64编码

    @CreateDateColumn() // 创建时间
    createdAt: Date;

    @UpdateDateColumn() // 更新时间
    updatedAt: Date;

    @ManyToOne(() => Bizi, bizi => bizi.images )
    @JoinColumn()
    bizi: Bizi
}
