import { MigrationInterface, QueryRunner } from 'typeorm';
import { Unit } from '../modules/articles/unit.entity';
import { Units2Seed } from '../seed/units2.seed';

export class UnitValues21591643297425 implements MigrationInterface {
  name = 'UnitValues21591643297425';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const unitRepo = queryRunner.connection.getRepository(Unit);
    await unitRepo.save(Units2Seed);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
