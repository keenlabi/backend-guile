import { MigrationInterface, QueryRunner } from "typeorm";

export class DropWalletAssets1767934194899 implements MigrationInterface {
    name = 'DropWalletAssets1767934194899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallets" DROP COLUMN "assets"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallets" ADD "assets" jsonb NOT NULL DEFAULT '{}'`);
    }

}
