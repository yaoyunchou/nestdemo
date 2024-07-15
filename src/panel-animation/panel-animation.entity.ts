import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable } from 'typeorm';
import { Panel } from './one-panel-animation.entity';

@Entity()
export class PanelAnimation {
    @PrimaryGeneratedColumn()
    id: number;  // 主键

    @Column()
    totalContent: string;  // 总内容

    @Column()
    prompt: string;  // 总提示

    @Column()
    imageUrl: string;  // 四格图片地址

    @Column()
    createTime: string;  // 创建时间

    @Column()
    updateTime: string;  // 更新时间

    @OneToMany(() => Panel, Panel => Panel.parent,  { cascade: ['insert'] })
    panels: Panel[];
}
