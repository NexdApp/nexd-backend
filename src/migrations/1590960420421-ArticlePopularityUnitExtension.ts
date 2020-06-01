import { MigrationInterface, QueryRunner } from 'typeorm';

export class ArticlePopularityUnitExtension1590960420421
  implements MigrationInterface {
  name = 'ArticlePopularityUnitExtension1590960420421';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "units" DROP COLUMN "name"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "articles" ADD "popularity" integer NOT NULL DEFAULT 0`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "units" ADD "nameZero" character varying NOT NULL`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "units" ADD "nameOne" character varying NOT NULL`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "units" ADD "nameTwo" character varying NOT NULL`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "units" ADD "nameFew" character varying NOT NULL`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "units" ADD "nameMany" character varying NOT NULL`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "units" ADD "nameOther" character varying NOT NULL`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3332f5557398abc93af6c88d3d" ON "articles" ("popularity") `,
      undefined,
    );

    // necessary to add seeds later
    await queryRunner.commitTransaction();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_3332f5557398abc93af6c88d3d"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "units" DROP COLUMN "nameOther"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "units" DROP COLUMN "nameMany"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "units" DROP COLUMN "nameFew"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "units" DROP COLUMN "nameTwo"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "units" DROP COLUMN "nameOne"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "units" DROP COLUMN "nameZero"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "articles" DROP COLUMN "popularity"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "units" ADD "name" character varying NOT NULL`,
      undefined,
    );
  }
}
