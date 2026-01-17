import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsManagedToProfile1768576504107 implements MigrationInterface {
    name = 'AddIsManagedToProfile1768576504107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."kyc_records_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED')`);
        await queryRunner.query(`CREATE TABLE "kyc_records" ("id" uuid NOT NULL, "user_id" uuid NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "dob" date NOT NULL, "country" character varying NOT NULL, "document_type" character varying NOT NULL, "document_front_url" character varying NOT NULL, "document_back_url" character varying NOT NULL, "selfie_url" character varying NOT NULL, "status" "public"."kyc_records_status_enum" NOT NULL DEFAULT 'PENDING', "rejection_reason" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_d20b5a5f164a27f1a823596d19" UNIQUE ("user_id"), CONSTRAINT "PK_116991f893d637ee173b9de8ed0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD "is_managed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "kyc_records" ADD CONSTRAINT "FK_d20b5a5f164a27f1a823596d192" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kyc_records" DROP CONSTRAINT "FK_d20b5a5f164a27f1a823596d192"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "is_managed"`);
        await queryRunner.query(`DROP TABLE "kyc_records"`);
        await queryRunner.query(`DROP TYPE "public"."kyc_records_status_enum"`);
    }

}
