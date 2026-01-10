import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderTable1767746124447 implements MigrationInterface {
    name = 'AddOrderTable1767746124447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."orders_side_enum" AS ENUM('BUY', 'SELL')`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('FILLED', 'PENDING', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL, "user_id" uuid NOT NULL, "symbol" character varying NOT NULL, "side" "public"."orders_side_enum" NOT NULL, "quantity" numeric(18,8) NOT NULL, "price" numeric(18,2) NOT NULL, "total_usd" numeric(18,2) NOT NULL, "status" "public"."orders_status_enum" NOT NULL DEFAULT 'FILLED', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_side_enum"`);
    }

}
