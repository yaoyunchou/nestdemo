import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BookData } from './bookData.entity';
import { XyShop } from '../../xyShop/entities/xyShop.entity';
import { ApiProperty } from '@nestjs/swagger';

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

  @ManyToOne(() => BookData, { nullable: true })
  @JoinColumn({ name: 'isbn' })
  bookData: BookData;


  @Column('text')
  @ApiProperty()
  content: string;

  @CreateDateColumn()
  @ApiProperty()
  createAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updateAt: Date;

  @Column({ default: 0 })
  @ApiProperty()
  exposure: number;

  @Column({ default: 0 })
  @ApiProperty()
  views: number;

  @Column({ default: 0 })
  @ApiProperty()
  wants: number;

  @OneToMany(() => XyShop, shop => shop.books)
  shops: XyShop[];

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

  @Column()
  @ApiProperty()
  shopID: string;
} 