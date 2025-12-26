import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1766011097100 implements MigrationInterface {
    name = 'Migrations1766011097100'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "communities" ADD "post_count" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "communities" DROP COLUMN "post_count"`);
    }

}
