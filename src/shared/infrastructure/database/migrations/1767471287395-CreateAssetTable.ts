import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAssetTable1767471287395 implements MigrationInterface {
    name = 'CreateAssetTable1767471287395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."assets_type_enum" AS ENUM('crypto', 'fiat', 'stablecoin')`);
        await queryRunner.query(`CREATE TABLE "assets" ("symbol" character varying NOT NULL, "name" character varying NOT NULL, "decimals" integer NOT NULL DEFAULT '8', "type" "public"."assets_type_enum" NOT NULL DEFAULT 'crypto', "is_deposit_enabled" boolean NOT NULL DEFAULT true, "is_withdrawal_enabled" boolean NOT NULL DEFAULT true, "is_trading_enabled" boolean NOT NULL DEFAULT true, "icon_url" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9b4bd5b9c6fe49cd3b4342fb914" PRIMARY KEY ("symbol"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "assets"`);
        await queryRunner.query(`DROP TYPE "public"."assets_type_enum"`);
    }

}
