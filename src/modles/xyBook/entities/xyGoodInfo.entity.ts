import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, Index, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { XyBook } from './xyBook.entity';

/** 
 * 商品信息从表
 */
@Entity('xy_good_info')
export class XyGoodInfo {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '商品信息ID' })
  id: number;

  @Column({ default: '' })
  @ApiProperty({ description: '店铺用户名' })
  user_name: string;

  @Column({ type: 'bigint' })
  @Index()
  @ApiProperty({ description: '商品ID' })
  item_id: number;

  @Column({ nullable: true })
  @ApiProperty({ description: '省份编码' })
  province: number;

  @Column({ nullable: true })
  @ApiProperty({ description: '城市编码' })
  city: number;

  @Column({ nullable: true})
  @ApiProperty({ description: '区域编码' })
  district: number;

  @Column({ type: 'varchar', length: 1000 })
  @ApiProperty({ description: '商品标题' })
  title: string;

  @Column('text')
  @ApiProperty({ description: '商品详情' })
  content: string;

  @Column('simple-array')
  @ApiProperty({ description: '商品图片列表', type: [String] })
  images: string[];

  @Column({ default: 1 })
  @ApiProperty({ description: '商品状态', example: 1 })
  status: number;

  @Column({nullable: true })
  @ApiProperty({ description: '白底图', required: false })
  white_images: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '服务支持', required: false })
  service_support: string;

  @ManyToOne(() => XyBook, book => book.publish_shop, { onDelete: 'CASCADE' })
  book: XyBook;

  @CreateDateColumn()
  @ApiProperty({ description: '创建时间' })
  createAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: '更新时间' })
  updateAt: Date;
}
