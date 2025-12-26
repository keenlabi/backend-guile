import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePostTable1763199177666 implements MigrationInterface {
    name = 'CreatePostTable1763199177666'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."posts_status_enum" AS ENUM('ACTIVE', 'REMOVED')`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "community_id" uuid NOT NULL, "author_id" uuid NOT NULL, "content" text NOT NULL, "status" "public"."posts_status_enum" NOT NULL DEFAULT 'ACTIVE', "path" ltree NOT NULL, "parent_id" uuid, "thread_id" uuid, "reply_count" integer NOT NULL DEFAULT '0', "last_reply_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_135c6b381cb1e4db047d2a6147" ON "posts" USING GiST ("path") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_135c6b381cb1e4db047d2a6147"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TYPE "public"."posts_status_enum"`);
    }

}
