import { MigrationInterface, QueryRunner } from "typeorm";

export class LocationTable1764693711274 implements MigrationInterface {
    name = 'LocationTable1764693711274'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" RENAME COLUMN "location" TO "location_id"`);
        await queryRunner.query(`CREATE TABLE "locations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "country" text NOT NULL DEFAULT 'Canada', "province" text NOT NULL, "city" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "location_id"`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD "location_id" uuid`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD CONSTRAINT "UQ_7a59daf6879b8b1623bace41f54" UNIQUE ("location_id")`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD CONSTRAINT "FK_7a59daf6879b8b1623bace41f54" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT "FK_7a59daf6879b8b1623bace41f54"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT "UQ_7a59daf6879b8b1623bace41f54"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "location_id"`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD "location_id" character varying(50) NOT NULL`);
        await queryRunner.query(`DROP TABLE "locations"`);
        await queryRunner.query(`ALTER TABLE "profiles" RENAME COLUMN "location_id" TO "location"`);
    }

}
