import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeKycBackUrlNullable1768576599999 implements MigrationInterface {
    name = 'MakeKycBackUrlNullable1768576599999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kyc_records" ALTER COLUMN "document_back_url" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Warning: This might fail if there are existing nulls
        await queryRunner.query(`UPDATE "kyc_records" SET "document_back_url" = '' WHERE "document_back_url" IS NULL`);
        await queryRunner.query(`ALTER TABLE "kyc_records" ALTER COLUMN "document_back_url" SET NOT NULL`);
    }
}