import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeProfileFieldsNullable1767486296831 implements MigrationInterface {
    name = 'MakeProfileFieldsNullable1767486296831'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" ALTER COLUMN "first_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profiles" ALTER COLUMN "last_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profiles" ALTER COLUMN "username" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profiles" ALTER COLUMN "date_of_birth" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" ALTER COLUMN "date_of_birth" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profiles" ALTER COLUMN "username" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profiles" ALTER COLUMN "last_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profiles" ALTER COLUMN "first_name" SET NOT NULL`);
    }

}
