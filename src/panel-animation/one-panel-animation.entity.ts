import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne } from 'typeorm';
import { PanelAnimation } from './panel-animation.entity';

@Entity()
export class Panel {
    @PrimaryGeneratedColumn()
    id: number;  // 主键

    @Column("text")
    prompt: string;  // 提示

    @Column("text")
    content: string;  // 内容

    @Column()
    index: number;  // 索引

    @Column("text")
    imageUrl: string;  // 图片地址

    @ManyToOne(() => PanelAnimation, panelAnimation => panelAnimation)
    parent: PanelAnimation;


}
