import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePostStatusEnum1763369037335 implements MigrationInterface {
    name = 'UpdatePostStatusEnum1763369037335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."posts_status_enum" RENAME TO "posts_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."posts_status_enum" AS ENUM('active', 'removed')`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "status" TYPE "public"."posts_status_enum" USING "status"::"text"::"public"."posts_status_enum"`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "status" SET DEFAULT 'active'`);
        await queryRunner.query(`DROP TYPE "public"."posts_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."posts_status_enum_old" AS ENUM('ACTIVE', 'REMOVED')`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "status" TYPE "public"."posts_status_enum_old" USING "status"::"text"::"public"."posts_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`);
        await queryRunner.query(`DROP TYPE "public"."posts_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."posts_status_enum_old" RENAME TO "posts_status_enum"`);
    }

}
