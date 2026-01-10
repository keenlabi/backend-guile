import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePredictionTable1767750671413 implements MigrationInterface {
    name = 'CreatePredictionTable1767750671413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."predictions_direction_enum" AS ENUM('HIGH', 'LOW')`);
        await queryRunner.query(`CREATE TYPE "public"."predictions_result_enum" AS ENUM('WIN', 'LOSS', 'DRAW')`);
        await queryRunner.query(`CREATE TYPE "public"."predictions_status_enum" AS ENUM('PENDING', 'RESOLVED')`);
        await queryRunner.query(`CREATE TABLE "predictions" ("id" uuid NOT NULL, "user_id" uuid NOT NULL, "symbol" character varying NOT NULL, "direction" "public"."predictions_direction_enum" NOT NULL, "investment" numeric(18,2) NOT NULL, "duration_seconds" integer NOT NULL, "open_price" numeric(18,2) NOT NULL, "close_price" numeric(18,2), "result" "public"."predictions_result_enum", "payout" numeric(18,2), "status" "public"."predictions_status_enum" NOT NULL DEFAULT 'PENDING', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "resolved_at" TIMESTAMP, CONSTRAINT "PK_b92c9e4db595214b289f5e28adc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "predictions" ADD CONSTRAINT "FK_8e4b27973471685734e213da971" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "predictions" DROP CONSTRAINT "FK_8e4b27973471685734e213da971"`);
        await queryRunner.query(`DROP TABLE "predictions"`);
        await queryRunner.query(`DROP TYPE "public"."predictions_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."predictions_result_enum"`);
        await queryRunner.query(`DROP TYPE "public"."predictions_direction_enum"`);
    }

}
