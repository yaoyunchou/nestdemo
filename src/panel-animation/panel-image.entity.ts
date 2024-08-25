import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { PanelAnimation } from './panel-animation.entity';
import { Panel } from './one-panel-animation.entity';

@Entity()
export class PanelImage {
    @PrimaryGeneratedColumn()
    id: number;  // 主键

    @Column("text", { nullable: true })
    url: string;  // 图片链接

    @Column("text", { nullable: true })
    base64: string;  // 图片base64

    @Column({default: false})
    combinedPicture:boolean; // 是否是合成图片

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Panel, panel => panel.images)
    panel: Panel;

}
