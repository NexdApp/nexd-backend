import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1590326322861 implements MigrationInterface {
    name = 'Init1590326322861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "categories_language_enum" AS ENUM('de', 'en')`, undefined);
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "language" "categories_language_enum" NOT NULL, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "articles_language_enum" AS ENUM('de', 'en')`, undefined);
        await queryRunner.query(`CREATE TYPE "articles_status_enum" AS ENUM('deactivated', 'active', 'verified')`, undefined);
        await queryRunner.query(`CREATE TABLE "articles" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "language" "articles_language_enum" NOT NULL, "status" "articles_status_enum" NOT NULL DEFAULT 'active', "unitIdOrder" integer array NOT NULL DEFAULT array[]::integer[], "categoryId" integer, CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_8091cfe937b28e7725def41508" ON "articles" ("language") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_5f0a73d2e1cc0db5557ae257d1" ON "articles" ("status") `, undefined);
        await queryRunner.query(`CREATE TYPE "units_language_enum" AS ENUM('de', 'en')`, undefined);
        await queryRunner.query(`CREATE TABLE "units" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "language" "units_language_enum" NOT NULL, "defaultOrder" integer NOT NULL DEFAULT 100, CONSTRAINT "PK_5a8f2f064919b587d93936cb223" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_71795b50dc42e2c978df0c1764" ON "units" ("language") `, undefined);
        await queryRunner.query(`CREATE TABLE "helpRequestArticle" ("id" SERIAL NOT NULL, "articleId" integer, "unitId" integer, "articleCount" integer NOT NULL, "articleDone" boolean NOT NULL DEFAULT false, "helpRequestId" integer, CONSTRAINT "PK_f1cfe16a076d2ed4d6c4c14f241" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "users_role_enum" AS ENUM('helper', 'seeker', 'none')`, undefined);
        await queryRunner.query(`CREATE TABLE "users" ("firstName" character varying(255), "lastName" character varying(255), "street" character varying(100), "number" character varying(100), "zipCode" character varying(10), "city" character varying(100), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255), "role" "users_role_enum" NOT NULL DEFAULT 'none', "phoneNumber" character varying, "password" character varying NOT NULL, "passwordResetToken" character varying, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_1e3d0240b49c40521aaeb95329" ON "users" ("phoneNumber") `, undefined);
        await queryRunner.query(`CREATE TABLE "calls" ("sid" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "recordingUrl" character varying, "phoneNumber" character varying, "country" character varying, "zip" character varying, "city" character varying, "converterId" uuid, CONSTRAINT "PK_ce4c64d464efbb2a47ba1993a7f" PRIMARY KEY ("sid"))`, undefined);
        await queryRunner.query(`CREATE TYPE "helpRequests_priority_enum" AS ENUM('low', 'medium', 'high')`, undefined);
        await queryRunner.query(`CREATE TYPE "helpRequests_status_enum" AS ENUM('pending', 'ongoing', 'completed', 'deactivated')`, undefined);
        await queryRunner.query(`CREATE TABLE "helpRequests" ("firstName" character varying(255), "lastName" character varying(255), "street" character varying(100), "number" character varying(100), "zipCode" character varying(10), "city" character varying(100), "id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "priority" "helpRequests_priority_enum" NOT NULL DEFAULT 'low', "additionalRequest" character varying, "deliveryComment" character varying, "phoneNumber" character varying(255), "status" "helpRequests_status_enum" NOT NULL DEFAULT 'pending', "requesterId" uuid, "helpListId" integer, "callSid" character varying, CONSTRAINT "REL_96bd932c3130330be34986e5e0" UNIQUE ("callSid"), CONSTRAINT "PK_f53425165dde90366d75b0431eb" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "helpLists_status_enum" AS ENUM('active', 'canceled', 'completed')`, undefined);
        await queryRunner.query(`CREATE TABLE "helpLists" ("id" SERIAL NOT NULL, "ownerId" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "helpLists_status_enum" NOT NULL DEFAULT 'active', CONSTRAINT "PK_1b4af28a7b0af0a3ca65e260861" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "locationInfos" ("zip" character varying NOT NULL, "country" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "stateShort" character varying NOT NULL, "area" character varying NOT NULL, "location" geography(Point) NOT NULL, CONSTRAINT "PK_b283e673123e433a79eb459a0c6" PRIMARY KEY ("location"))`, undefined);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_9cf383b5c60045a773ddced7f23" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "helpRequestArticle" ADD CONSTRAINT "FK_a8816058a3c850d3bd580a33197" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "helpRequestArticle" ADD CONSTRAINT "FK_8c8f5eb07c42463edf00cd8314d" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "helpRequestArticle" ADD CONSTRAINT "FK_d2f6247f4917f056cf4a9eb8f5a" FOREIGN KEY ("helpRequestId") REFERENCES "helpRequests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "calls" ADD CONSTRAINT "FK_3c7cb30ae4304f36d9298c669f1" FOREIGN KEY ("converterId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "helpRequests" ADD CONSTRAINT "FK_cf33984945f4a32733833d3546c" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "helpRequests" ADD CONSTRAINT "FK_683ace2b27acfc17187a3102a72" FOREIGN KEY ("helpListId") REFERENCES "helpLists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "helpRequests" ADD CONSTRAINT "FK_96bd932c3130330be34986e5e0c" FOREIGN KEY ("callSid") REFERENCES "calls"("sid") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "helpLists" ADD CONSTRAINT "FK_ee9aaefd249429fd2d7c24ba3d9" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "helpLists" DROP CONSTRAINT "FK_ee9aaefd249429fd2d7c24ba3d9"`, undefined);
        await queryRunner.query(`ALTER TABLE "helpRequests" DROP CONSTRAINT "FK_96bd932c3130330be34986e5e0c"`, undefined);
        await queryRunner.query(`ALTER TABLE "helpRequests" DROP CONSTRAINT "FK_683ace2b27acfc17187a3102a72"`, undefined);
        await queryRunner.query(`ALTER TABLE "helpRequests" DROP CONSTRAINT "FK_cf33984945f4a32733833d3546c"`, undefined);
        await queryRunner.query(`ALTER TABLE "calls" DROP CONSTRAINT "FK_3c7cb30ae4304f36d9298c669f1"`, undefined);
        await queryRunner.query(`ALTER TABLE "helpRequestArticle" DROP CONSTRAINT "FK_d2f6247f4917f056cf4a9eb8f5a"`, undefined);
        await queryRunner.query(`ALTER TABLE "helpRequestArticle" DROP CONSTRAINT "FK_8c8f5eb07c42463edf00cd8314d"`, undefined);
        await queryRunner.query(`ALTER TABLE "helpRequestArticle" DROP CONSTRAINT "FK_a8816058a3c850d3bd580a33197"`, undefined);
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_9cf383b5c60045a773ddced7f23"`, undefined);
        await queryRunner.query(`DROP TABLE "locationInfos"`, undefined);
        await queryRunner.query(`DROP TABLE "helpLists"`, undefined);
        await queryRunner.query(`DROP TYPE "helpLists_status_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "helpRequests"`, undefined);
        await queryRunner.query(`DROP TYPE "helpRequests_status_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "helpRequests_priority_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "calls"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_1e3d0240b49c40521aaeb95329"`, undefined);
        await queryRunner.query(`DROP TABLE "users"`, undefined);
        await queryRunner.query(`DROP TYPE "users_role_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "helpRequestArticle"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_71795b50dc42e2c978df0c1764"`, undefined);
        await queryRunner.query(`DROP TABLE "units"`, undefined);
        await queryRunner.query(`DROP TYPE "units_language_enum"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_5f0a73d2e1cc0db5557ae257d1"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_8091cfe937b28e7725def41508"`, undefined);
        await queryRunner.query(`DROP TABLE "articles"`, undefined);
        await queryRunner.query(`DROP TYPE "articles_status_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "articles_language_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "categories"`, undefined);
        await queryRunner.query(`DROP TYPE "categories_language_enum"`, undefined);
    }

}
