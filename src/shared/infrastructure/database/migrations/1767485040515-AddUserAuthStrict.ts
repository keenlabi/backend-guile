import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserAuthStrict1767485040515 implements MigrationInterface {
    name = 'AddUserAuthStrict1767485040515'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "passwordHash" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "passwordHash" DROP NOT NULL`);
    }

}
