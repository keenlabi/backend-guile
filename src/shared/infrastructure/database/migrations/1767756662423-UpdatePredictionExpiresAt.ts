import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePredictionExpiresAt1767756662423 implements MigrationInterface {
    name = 'UpdatePredictionExpiresAt1767756662423'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Wipe existing test data to avoid "NOT NULL" constraint errors
        await queryRunner.query(`DELETE FROM "predictions"`);

        // 2. Drop the old column
        await queryRunner.query(`ALTER TABLE "predictions" DROP COLUMN "duration_seconds"`);

        // 3. Add the new column (safe now because table is empty)
        await queryRunner.query(`ALTER TABLE "predictions" ADD "expires_at" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert steps (Wiping data again to be safe)
        await queryRunner.query(`DELETE FROM "predictions"`);
        await queryRunner.query(`ALTER TABLE "predictions" DROP COLUMN "expires_at"`);
        await queryRunner.query(`ALTER TABLE "predictions" ADD "duration_seconds" integer NOT NULL`);
    }

}