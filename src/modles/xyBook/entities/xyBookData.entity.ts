import { Entity, Column, PrimaryColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { XyBook } from './xyBook.entity';

@Entity('xy_book_data')
export class XyBookData {
  @PrimaryColumn()
  @ApiProperty()
  isbn: string;

  /**
   * 书名
   */
  @Column({ type: 'varchar', length: 1000 })
  @ApiProperty()
  title: string;

  /**
   * 作者
   */
  @Column({ type: 'varchar', length: 1000, nullable: true })
  @ApiProperty()
  author: string;

  /**
   * 出版社
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty()
  publisher: string;

  @OneToMany(() => XyBook, book => book.book_data) 
  books: XyBook[];
  
  @CreateDateColumn()
  @ApiProperty({ description: '创建时间' })
  createAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: '更新时间' })
  updateAt: Date;
} 