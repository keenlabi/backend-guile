import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1766008339063 implements MigrationInterface {
    name = 'Migrations1766008339063'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "communities" ADD "member_count" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "communities" DROP COLUMN "member_count"`);
    }

}
