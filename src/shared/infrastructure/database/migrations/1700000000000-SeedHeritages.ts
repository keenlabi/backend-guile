import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedHeritages1700000000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO heritages (name, description) VALUES
              ('canadian', 'Canadian'),
              ('english', 'English'),
              ('french', 'French'),
              ('scottish', 'Scottish'),
              ('irish', 'Irish'),
              ('german', 'German'),
              ('chinese', 'Chinese'),
              ('italian', 'Italian'),
              ('first_nations', 'First Nations'),
              ('indian', 'Indian'),
              ('ukrainian', 'Ukrainian'),
              ('dutch', 'Dutch'),
              ('polish', 'Polish'),
              ('filipino', 'Filipino'),
              ('metis', 'Métis'),
              ('inuit', 'Inuit'),
              ('russian', 'Russian'),
              ('norwegian', 'Norwegian'),
              ('portuguese', 'Portuguese'),
              ('welsh', 'Welsh'),
              ('spanish', 'Spanish'),
              ('jamaican', 'Jamaican'),
              ('pakistani', 'Pakistani'),
              ('vietnamese', 'Vietnamese'),
              ('korean', 'Korean'),
              ('iranian', 'Iranian'),
              ('greek', 'Greek'),
              ('jewish', 'Jewish'),
              ('lebanese', 'Lebanese'),
              ('haitian', 'Haitian')
            ON CONFLICT (name) DO NOTHING;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Caution: This deletes all rows. 
        // In a real production app, you might want to be more selective 
        // or just leave the data as it's harmless.
        await queryRunner.query(`DELETE FROM heritages`);
    }

}