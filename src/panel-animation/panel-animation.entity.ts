import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Panel } from './one-panel-animation.entity';

@Entity()
export class PanelAnimation {
    @PrimaryGeneratedColumn()
    id: number;  // 主键

    @Column("text")
    totalContent: string;  // 总内容， 可能是多个agent 输出的内容组合

    @Column("text")
    prompt: string;  // 场景的提示词，  有可能生产出一个大纲


    @Column("text")
    title: string;  // 标题

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
    
    @OneToMany(() => Panel, Panel => Panel.parent,  { cascade: true})
    panels: Panel[];
}
