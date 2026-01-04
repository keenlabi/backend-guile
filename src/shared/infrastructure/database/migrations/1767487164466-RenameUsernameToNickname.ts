import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameUsernameToNickname1767487164466 implements MigrationInterface {
    name = 'RenameUsernameToNickname1767487164466'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" RENAME COLUMN "username" TO "nickname"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" RENAME COLUMN "nickname" TO "username"`);
    }

}
