import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1763199086467 implements MigrationInterface {
    name = 'InitialSchema1763199086467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_roles_status_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "user_roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "role_id" uuid NOT NULL, "status" "public"."user_roles_status_enum" NOT NULL DEFAULT 'pending', "requested_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_23ed6f04fe43066df08379fd034" UNIQUE ("user_id", "role_id"), CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'suspended', 'deactivated')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL, "email" character varying NOT NULL, "email_verified" boolean NOT NULL DEFAULT false, "status" "public"."users_status_enum" NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "first_name" text NOT NULL, "last_name" text NOT NULL, "username" text NOT NULL, "date_of_birth" TIMESTAMP NOT NULL, "gender" text NOT NULL, "bio" text, "location" character varying(50) NOT NULL, "avatar_url" character varying(100), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9e432b7df0d182f8d292902d1a2" UNIQUE ("user_id"), CONSTRAINT "REL_9e432b7df0d182f8d292902d1a" UNIQUE ("user_id"), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "heritages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_76d5f06e5c5f589f751ac795030" UNIQUE ("name"), CONSTRAINT "PK_defdf9ac2b0b87e4a024c84c451" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cultural_identity_heritages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cultural_identity_id" uuid NOT NULL, "heritage_id" uuid, "custom_heritage" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_bfd156338840ca39aca963f924e" UNIQUE ("cultural_identity_id", "heritage_id"), CONSTRAINT "PK_4fdc464c6036067bd80b80114d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cultural_identities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "name" character varying(150), "nationality" character varying(100), "origin_country" character varying(100), "languages" character varying array, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_92dda0f5780dc95fcf3e2673f87" UNIQUE ("user_id"), CONSTRAINT "UQ_92dda0f5780dc95fcf3e2673f87" UNIQUE ("user_id"), CONSTRAINT "REL_92dda0f5780dc95fcf3e2673f8" UNIQUE ("user_id"), CONSTRAINT "PK_71e75bbac1b2710ae07d0fc2374" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "seeker_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "cultural_identity_id" uuid, "metadata" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_793cb315aaaee6967a4d0f828c4" UNIQUE ("user_id"), CONSTRAINT "REL_793cb315aaaee6967a4d0f828c" UNIQUE ("user_id"), CONSTRAINT "PK_868cf8b566dce7fd31f1dcebb0f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_identities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "provider" character varying(50) NOT NULL, "provider_id" character varying, "password_hash" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e23bff04e9c3e7b785e442b262c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."host_applications_status_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "host_applications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "status" "public"."host_applications_status_enum" NOT NULL DEFAULT 'pending', "motivation_text" text NOT NULL, "vision_text" text NOT NULL, "experience_text" text NOT NULL, "verification_document_url" character varying NOT NULL, "social_links" jsonb NOT NULL, "submission_timestamp" TIMESTAMP NOT NULL DEFAULT now(), "rejection_reason" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_eb57db5a4c1e7fcb96184707b7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "host_profiles" ("id" character varying NOT NULL, "user_id" uuid NOT NULL, "bio" text, "is_verified" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "REL_4f1ceff9c7c46687c9d6e33b0c" UNIQUE ("user_id"), CONSTRAINT "PK_b18e085fbb682ef6500397db396" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."communities_privacy_enum" AS ENUM('public', 'private', 'secret')`);
        await queryRunner.query(`CREATE TYPE "public"."communities_type_enum" AS ENUM('general', 'professional', 'social')`);
        await queryRunner.query(`CREATE TABLE "communities" ("id" uuid NOT NULL, "host_id" uuid NOT NULL, "name" character varying(50) NOT NULL, "description" character varying(500) NOT NULL, "privacy" "public"."communities_privacy_enum" NOT NULL DEFAULT 'public', "type" "public"."communities_type_enum" NOT NULL DEFAULT 'general', "banner_url" character varying(2048), "guidelines" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "hostId" uuid, CONSTRAINT "PK_fea1fe83c86ccde9d0a089e7ea2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."community_members_role_enum" AS ENUM('host', 'member')`);
        await queryRunner.query(`CREATE TYPE "public"."community_members_status_enum" AS ENUM('active', 'left', 'suspended', 'banned')`);
        await queryRunner.query(`CREATE TABLE "community_members" ("community_id" uuid NOT NULL, "user_id" uuid NOT NULL, "role" "public"."community_members_role_enum" NOT NULL DEFAULT 'member', "status" "public"."community_members_status_enum" NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a304f5a705ec45c9d11b5618287" PRIMARY KEY ("community_id", "user_id"))`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD CONSTRAINT "FK_9e432b7df0d182f8d292902d1a2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cultural_identity_heritages" ADD CONSTRAINT "FK_f86ea22dc402f0d73708eb2f0b7" FOREIGN KEY ("cultural_identity_id") REFERENCES "cultural_identities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cultural_identity_heritages" ADD CONSTRAINT "FK_ebc5af059dd9d8b00cd1f83bac1" FOREIGN KEY ("heritage_id") REFERENCES "heritages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cultural_identities" ADD CONSTRAINT "FK_92dda0f5780dc95fcf3e2673f87" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "seeker_profiles" ADD CONSTRAINT "FK_793cb315aaaee6967a4d0f828c4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "seeker_profiles" ADD CONSTRAINT "FK_1e787a3b72dfe59715b0eb8d36d" FOREIGN KEY ("cultural_identity_id") REFERENCES "cultural_identities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_identities" ADD CONSTRAINT "FK_bf5fe01eb8cad7114b4c371cdc7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "host_applications" ADD CONSTRAINT "FK_e8585396ab1eafae2bb2311ea20" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "host_profiles" ADD CONSTRAINT "FK_4f1ceff9c7c46687c9d6e33b0c4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "communities" ADD CONSTRAINT "FK_4dc5bc1e53025d6d3cf9cba9675" FOREIGN KEY ("hostId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "community_members" ADD CONSTRAINT "FK_46eb2c3e2d8b84acbd9a78974ab" FOREIGN KEY ("community_id") REFERENCES "communities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "community_members" ADD CONSTRAINT "FK_59ac0a0f039c16f8429ec9bda5d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "community_members" DROP CONSTRAINT "FK_59ac0a0f039c16f8429ec9bda5d"`);
        await queryRunner.query(`ALTER TABLE "community_members" DROP CONSTRAINT "FK_46eb2c3e2d8b84acbd9a78974ab"`);
        await queryRunner.query(`ALTER TABLE "communities" DROP CONSTRAINT "FK_4dc5bc1e53025d6d3cf9cba9675"`);
        await queryRunner.query(`ALTER TABLE "host_profiles" DROP CONSTRAINT "FK_4f1ceff9c7c46687c9d6e33b0c4"`);
        await queryRunner.query(`ALTER TABLE "host_applications" DROP CONSTRAINT "FK_e8585396ab1eafae2bb2311ea20"`);
        await queryRunner.query(`ALTER TABLE "user_identities" DROP CONSTRAINT "FK_bf5fe01eb8cad7114b4c371cdc7"`);
        await queryRunner.query(`ALTER TABLE "seeker_profiles" DROP CONSTRAINT "FK_1e787a3b72dfe59715b0eb8d36d"`);
        await queryRunner.query(`ALTER TABLE "seeker_profiles" DROP CONSTRAINT "FK_793cb315aaaee6967a4d0f828c4"`);
        await queryRunner.query(`ALTER TABLE "cultural_identities" DROP CONSTRAINT "FK_92dda0f5780dc95fcf3e2673f87"`);
        await queryRunner.query(`ALTER TABLE "cultural_identity_heritages" DROP CONSTRAINT "FK_ebc5af059dd9d8b00cd1f83bac1"`);
        await queryRunner.query(`ALTER TABLE "cultural_identity_heritages" DROP CONSTRAINT "FK_f86ea22dc402f0d73708eb2f0b7"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT "FK_9e432b7df0d182f8d292902d1a2"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`DROP TABLE "community_members"`);
        await queryRunner.query(`DROP TYPE "public"."community_members_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."community_members_role_enum"`);
        await queryRunner.query(`DROP TABLE "communities"`);
        await queryRunner.query(`DROP TYPE "public"."communities_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."communities_privacy_enum"`);
        await queryRunner.query(`DROP TABLE "host_profiles"`);
        await queryRunner.query(`DROP TABLE "host_applications"`);
        await queryRunner.query(`DROP TYPE "public"."host_applications_status_enum"`);
        await queryRunner.query(`DROP TABLE "user_identities"`);
        await queryRunner.query(`DROP TABLE "seeker_profiles"`);
        await queryRunner.query(`DROP TABLE "cultural_identities"`);
        await queryRunner.query(`DROP TABLE "cultural_identity_heritages"`);
        await queryRunner.query(`DROP TABLE "heritages"`);
        await queryRunner.query(`DROP TABLE "profiles"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP TYPE "public"."user_roles_status_enum"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
