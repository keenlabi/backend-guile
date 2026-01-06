import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTransactionTable1767610192496 implements MigrationInterface {
    name = 'CreateTransactionTable1767610192496'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL, "user_id" uuid NOT NULL, "type" character varying NOT NULL, "symbol" character varying NOT NULL, "amount_usd" numeric(18,2) NOT NULL, "token_amount" numeric(18,8) NOT NULL, "rate_at_time" numeric(18,8) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
    }

}
