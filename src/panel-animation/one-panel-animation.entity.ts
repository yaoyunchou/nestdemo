import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { PanelAnimation } from './panel-animation.entity';
import { PanelImage } from './panel-image.entity';

@Entity()
export class Panel {
    @PrimaryGeneratedColumn()
    id: number;  // 主键

    @Column("text")
    prompt: string;  // 图片提示词

    @Column("text")
    promptImage: string;  // 图片提示词， 给midjourney 用的

    @Column("text")
    content: string;  // gpt 产出的完整内容

    // 章节标题名称
    @Column()
    title: string;  // 标题

    // 章节标题名称
    @Column("text")
    desc: string;  // 标题对应的描述内容

    @Column()
    index: number;  // 索引,或者第几个章节


    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;


    
    @ManyToOne(() => PanelAnimation, panelAnimation => panelAnimation)
    parent: PanelAnimation;

    @OneToMany(() => PanelImage, panelImage => panelImage.panel, { cascade: true })
    images: PanelImage[];

    // 合成图片url
    combinedPicture: PanelImage;
 
}
