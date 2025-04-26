import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexToXyGoodInfo1744354207337 implements MigrationInterface {
    name = 'AddIndexToXyGoodInfo1744354207337'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX IDX_xy_good_info_item_id ON xy_good_info (item_id)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IDX_xy_good_info_item_id ON xy_good_info`);
    }
} 