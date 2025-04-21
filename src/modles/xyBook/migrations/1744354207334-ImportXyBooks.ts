import { MigrationInterface, QueryRunner } from 'typeorm';

export class ImportXyBooks1744354207334 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 创建表
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS xy_books (
        _id VARCHAR(255) PRIMARY KEY,
        product_id BIGINT NOT NULL,
        title VARCHAR(255),
        isbn VARCHAR(255),
        book_data JSON,
        content TEXT,
        createAt BIGINT,
        updateAt BIGINT,
        exposure INT DEFAULT 0,
        views INT DEFAULT 0,
        wants INT DEFAULT 0,
        publish_shop JSON,
        price DECIMAL(10,2),
        product_status INT,
        statusText VARCHAR(255),
        shopName VARCHAR(255),
        shopID VARCHAR(255)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 导入数据
    const books = require('../modles/xyBook/data.json');
    for (const book of books) {
      await queryRunner.query(`
        INSERT INTO xy_books (
          _id, product_id, title, isbn, book_data, content, 
          createAt, updateAt, exposure, views, wants, 
          publish_shop, price, product_status, statusText, 
          shopName, shopID
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        book._id,
        book.product_id,
        book.title,
        book.isbn,
        JSON.stringify(book.book_data),
        book.content,
        book.createAt,
        book.updateAt,
        book.exposure || 0,
        book.views || 0,
        book.wants || 0,
        JSON.stringify(book.publish_shop),
        book.price,
        book.product_status,
        book.statusText,
        book.shopName,
        book.shopID
      ]);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS xy_books`);
  }
} 