import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorXyBookRelations1744354207335 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 创建 book_data 表
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS xy_book_data (
        isbn VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        publisher VARCHAR(255),
        author VARCHAR(255)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 创建 shops 表
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS xy_shops (
        item_id BIGINT PRIMARY KEY,
        user_name VARCHAR(255) NOT NULL,
        province INT,
        city INT,
        district INT,
        title VARCHAR(255),
        content TEXT,
        images TEXT,
        status INT,
        white_images VARCHAR(255),
        service_support VARCHAR(255),
        book_id VARCHAR(255),
        FOREIGN KEY (book_id) REFERENCES xy_books(_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 修改 xy_books 表，添加外键关系
    await queryRunner.query(`
      ALTER TABLE xy_books
      ADD CONSTRAINT fk_book_data
      FOREIGN KEY (isbn) REFERENCES xy_book_data(isbn);
    `);

    // 从现有数据中提取 book_data 并插入到新表
    await queryRunner.query(`
      INSERT INTO xy_book_data (isbn, title, publisher, author)
      SELECT DISTINCT 
        JSON_UNQUOTE(JSON_EXTRACT(book_data, '$.isbn')) as isbn,
        JSON_UNQUOTE(JSON_EXTRACT(book_data, '$.title')) as title,
        JSON_UNQUOTE(JSON_EXTRACT(book_data, '$.publisher')) as publisher,
        JSON_UNQUOTE(JSON_EXTRACT(book_data, '$.author')) as author
      FROM xy_books
      WHERE book_data IS NOT NULL
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        publisher = VALUES(publisher),
        author = VALUES(author);
    `);

    // 从现有数据中提取 shops 并插入到新表
    await queryRunner.query(`
      INSERT INTO xy_shops (
        item_id, user_name, province, city, district,
        title, content, images, status, white_images,
        service_support, book_id
      )
      SELECT 
        shop.item_id,
        shop.user_name,
        shop.province,
        shop.city,
        shop.district,
        shop.title,
        shop.content,
        JSON_ARRAYAGG(shop.images) as images,
        shop.status,
        shop.white_images,
        shop.service_support,
        b._id as book_id
      FROM xy_books b,
      JSON_TABLE(
        b.publish_shop,
        '$[*]' COLUMNS (
          item_id BIGINT PATH '$.item_id',
          user_name VARCHAR(255) PATH '$.user_name',
          province INT PATH '$.province',
          city INT PATH '$.city',
          district INT PATH '$.district',
          title VARCHAR(255) PATH '$.title',
          content TEXT PATH '$.content',
          images JSON PATH '$.images',
          status INT PATH '$.status',
          white_images VARCHAR(255) PATH '$.white_images',
          service_support VARCHAR(255) PATH '$.service_support'
        )
      ) AS shop
      GROUP BY shop.item_id, b._id;
    `);

    // 删除旧的 JSON 列
    await queryRunner.query(`
      ALTER TABLE xy_books
      DROP COLUMN book_data,
      DROP COLUMN publish_shop;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 恢复旧的 JSON 列
    await queryRunner.query(`
      ALTER TABLE xy_books
      ADD COLUMN book_data JSON,
      ADD COLUMN publish_shop JSON;
    `);

    // 从新表中恢复数据到 JSON 列
    await queryRunner.query(`
      UPDATE xy_books b
      SET book_data = (
        SELECT JSON_OBJECT(
          'isbn', bd.isbn,
          'title', bd.title,
          'publisher', bd.publisher,
          'author', bd.author
        )
        FROM xy_book_data bd
        WHERE bd.isbn = b.isbn
      );
    `);

    await queryRunner.query(`
      UPDATE xy_books b
      SET publish_shop = (
        SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'item_id', s.item_id,
            'user_name', s.user_name,
            'province', s.province,
            'city', s.city,
            'district', s.district,
            'title', s.title,
            'content', s.content,
            'images', s.images,
            'status', s.status,
            'white_images', s.white_images,
            'service_support', s.service_support
          )
        )
        FROM xy_shops s
        WHERE s.book_id = b._id
      );
    `);

    // 删除外键约束
    await queryRunner.query(`
      ALTER TABLE xy_books
      DROP FOREIGN KEY fk_book_data;
    `);

    // 删除新表
    await queryRunner.query(`DROP TABLE IF EXISTS xy_shops`);
    await queryRunner.query(`DROP TABLE IF EXISTS xy_book_data`);
  }
} 