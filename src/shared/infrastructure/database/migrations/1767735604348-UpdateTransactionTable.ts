import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTransactionTable1767735604348 implements MigrationInterface {
    name = 'UpdateTransactionTable1767735604348'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transactions_status_enum" AS ENUM('PENDING', 'COMPLETED', 'FAILED')`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "status" "public"."transactions_status_enum" NOT NULL DEFAULT 'COMPLETED'`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "tx_hash" character varying`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "sender_address" character varying`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "network" character varying`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_type_enum" AS ENUM('DEPOSIT', 'WITHDRAWAL')`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "type" "public"."transactions_type_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "network"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "sender_address"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "tx_hash"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
    }

}
