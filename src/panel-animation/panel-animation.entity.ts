import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Panel } from './one-panel-animation.entity';

@Entity()
export class PanelAnimation {
    @PrimaryGeneratedColumn()
    id: number;  // 主键

    @Column("text")
    totalContent: string;  // 总内容

    @Column("text")
    prompt: string;  // 总提示

    @Column("text")
    imageUrl: string;  // 四格图片地址

    @Column()
    createTime: string;  // 创建时间

    @Column()
    updateTime: string;  // 更新时间

    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
    
    @OneToMany(() => Panel, Panel => Panel.parent,  { cascade: ['insert'] })
    panels: Panel[];
}
