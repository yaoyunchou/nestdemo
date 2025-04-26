import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { XyBookData } from './xyBookData.entity';
import { XyShop } from '../../xyShop/entities/xyShop.entity';

import { ApiProperty } from '@nestjs/swagger';
import { XyGoodInfo } from './xyGoodInfo.entity';

@Entity('xy_books')
export class XyBook {
  @PrimaryColumn()
  @ApiProperty()
  _id: string;

  @Column({ type: 'bigint' })
  @ApiProperty()
  product_id: number;

  @Column({ type: 'varchar', length: 1000 })
  @ApiProperty()
  title: string;

  @Column()
  @ApiProperty()
  isbn: string;

  @ManyToOne(() => XyBookData)
  @JoinColumn({ name: 'isbn' })
  book_data: XyBookData;

  @Column('text')
  @ApiProperty()
  content: string;

  // 创建时间 和 更新时间 是自动生成的
  @CreateDateColumn()
  @ApiProperty({ description: '创建时间' })
  createAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: '更新时间' })
  updateAt: Date;

  @Column({ default: 0 })
  @ApiProperty({ description: '曝光量' })
  exposure: number;

  @Column({ default: 0 })
  @ApiProperty({ description: '浏览量' })
  views: number;

  @Column({ default: 0 })
  @ApiProperty({ description: '想买量' } )
  wants: number;

  @OneToMany(() => XyShop, shop => shop.books)
  shops: XyShop[];

  @OneToMany(() => XyGoodInfo, goodInfo => goodInfo.book)
  @ApiProperty({ type: () => [XyGoodInfo] })
  publish_shop: XyGoodInfo[];

  @Column('decimal', { precision: 10, scale: 2 })
  @ApiProperty()
  price: number;

  @Column()
  @ApiProperty()
  product_status: number;

  @Column()
  @ApiProperty()
  statusText: string;

  @Column()
  @ApiProperty()
  shopName: string;

  @Column({ default: '', nullable: true })
  @ApiProperty({ description: '店铺ID' , required: false,default:''})
  shopID: string;
} 