import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyArticleStatus1590358948116 implements MigrationInterface {
  name = 'ModifyArticleStatus1590358948116';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "articles" ADD "statusOverwritten" boolean NOT NULL DEFAULT false`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "articles" ALTER COLUMN "unitIdOrder" DROP DEFAULT`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "articles" ALTER COLUMN "unitIdOrder" SET DEFAULT ARRAY[]`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "articles" DROP COLUMN "statusOverwritten"`,
      undefined,
    );
  }
}
