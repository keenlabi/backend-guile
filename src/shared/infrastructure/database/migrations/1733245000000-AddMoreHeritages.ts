import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMoreHeritages1700000000001 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO heritages (name, description) VALUES
              -- Africa
              ('amhara', 'Amhara'),
              ('oromo', 'Oromo'),
              ('tigray', 'Tigray'),
              ('somali', 'Somali'),
              ('akan', 'Akan'),
              ('ewe', 'Ewe'),
              ('ga', 'Ga'),
              ('zulu', 'Zulu'),
              ('xhosa', 'Xhosa'),
              ('shona', 'Shona'),
              ('ndebele', 'Ndebele'),
              ('kikuyu', 'Kikuyu'),
              ('luo', 'Luo'),
              ('luhya', 'Luhya'),
              ('baganda', 'Baganda'),
              ('swahili', 'Swahili'),
              ('berber', 'Berber / Amazigh'),
              ('egyptian', 'Egyptian'),
              ('nubian', 'Nubian'),
              ('fulani', 'Fulani'),
              ('wolof', 'Wolof'),
              ('mende', 'Mende'),
              ('temne', 'Temne'),
              ('mandinka', 'Mandinka'),
              ('bambara', 'Bambara'),

              -- Asia
              ('punjabi', 'Punjabi'),
              ('bengali', 'Bengali'),
              ('tamil', 'Tamil'),
              ('gujarati', 'Gujarati'),
              ('malayalam', 'Malayalam'),
              ('telugu', 'Telugu'),
              ('sindhi', 'Sindhi'),
              ('pashtun', 'Pashtun'),
              ('hazara', 'Hazara'),
              ('tajik', 'Tajik'),
              ('uzbek', 'Uzbek'),
              ('kazakh', 'Kazakh'),
              ('kyrgyz', 'Kyrgyz'),
              ('uighur', 'Uighur'),
              ('tibetan', 'Tibetan'),
              ('nepali', 'Nepali'),
              ('sinhalese', 'Sinhalese'),
              ('khmer', 'Khmer'),
              ('lao', 'Lao'),
              ('hmong', 'Hmong'),
              ('thai', 'Thai'),
              ('malay', 'Malay'),
              ('indonesian', 'Indonesian'),
              ('javanese', 'Javanese'),
              ('sundanese', 'Sundanese'),
              ('japanese', 'Japanese'),
              ('mongolian', 'Mongolian'),

              -- Middle East
              ('arab', 'Arab'),
              ('kurdish', 'Kurdish'),
              ('persian', 'Persian'),
              ('armenian', 'Armenian'),
              ('assyrian', 'Assyrian'),
              ('chaldean', 'Chaldean'),
              ('turkmen', 'Turkmen'),
              ('turkish', 'Turkish'),
              ('azeri', 'Azeri'),
              ('georgian', 'Georgian'),

              -- Europe
              ('slavic', 'Slavic'),
              ('scandinavian', 'Scandinavian'),
              ('celtic', 'Celtic'),
              ('baltic', 'Baltic'),
              ('romani', 'Romani'),
              ('basque', 'Basque'),
              ('catalan', 'Catalan'),
              ('flemish', 'Flemish'),
              ('walloon', 'Walloon'),
              ('swiss', 'Swiss'),
              ('austrian', 'Austrian'),
              ('hungarian', 'Hungarian'),
              ('romanian', 'Romanian'),
              ('bulgarian', 'Bulgarian'),
              ('serbian', 'Serbian'),
              ('croatian', 'Croatian'),
              ('bosnian', 'Bosnian'),
              ('albanian', 'Albanian'),
              ('macedonian', 'Macedonian'),
              ('slovenian', 'Slovenian'),
              ('slovak', 'Slovak'),
              ('czech', 'Czech'),
              ('belarusian', 'Belarusian'),
              ('latvian', 'Latvian'),
              ('lithuanian', 'Lithuanian'),
              ('estonian', 'Estonian'),
              ('finnish', 'Finnish'),
              ('icelandic', 'Icelandic'),
              ('maltese', 'Maltese'),

              -- Americas & Caribbean
              ('mexican', 'Mexican'),
              ('colombian', 'Colombian'),
              ('venezuelan', 'Venezuelan'),
              ('brazilian', 'Brazilian'),
              ('peruvian', 'Peruvian'),
              ('chilean', 'Chilean'),
              ('argentinian', 'Argentinian'),
              ('cuban', 'Cuban'),
              ('dominican', 'Dominican'),
              ('puerto_rican', 'Puerto Rican'),
              ('trinidadian', 'Trinidadian'),
              ('guyanese', 'Guyanese'),
              ('surinamese', 'Surinamese'),
              ('mayan', 'Mayan'),
              ('quechua', 'Quechua'),
              ('aymara', 'Aymara'),
              ('guarani', 'Guaraní'),
              ('mapuche', 'Mapuche'),

              -- Oceania
              ('maori', 'Māori'),
              ('samoan', 'Samoan'),
              ('tongan', 'Tongan'),
              ('fijian', 'Fijian'),
              ('hawaiian', 'Hawaiian'),
              ('papuan', 'Papuan'),
              ('aboriginal_australian', 'Aboriginal Australian')

            ON CONFLICT (name) DO NOTHING;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Option 1: Do nothing (safest, leaves data)
        // Option 2: Delete specific ones (tedious to maintain)
        // Option 3: Delete ALL (nuclear option, good for dev reset)
        // We'll stick to Option 1 for safety in this example, or you can 
        // uncomment the line below if you want to be able to wipe them.
        
        // await queryRunner.query(`DELETE FROM heritages`); 
    }

}