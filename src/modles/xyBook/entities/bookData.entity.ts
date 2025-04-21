import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { XyBook } from './xyBook.entity';

@Entity('book_data')
export class BookData {
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

  @OneToMany(() => XyBook, book => book.bookData)
  books: XyBook[];
} 