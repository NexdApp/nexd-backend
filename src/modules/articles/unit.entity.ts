import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';
import { AvailableLanguages } from '../../constants/languages';

@Entity({
  name: 'units',
})
export class Unit {
  @ApiProperty({
    description: 'Auto-incremented ID of a unit.',
    type: 'integer',
    format: 'int64',
  })
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  nameZero!: string;

  @Column()
  nameOne!: string;

  @Column()
  nameTwo!: string;

  @Column()
  nameFew!: string;

  @Column()
  nameMany!: string;

  @Column()
  nameOther!: string;

  @ApiProperty({
    description: 'Abbreviated name of the unit',
  })
  @Column()
  nameShort!: string;

  @ApiProperty({
    description: 'Language key of this unit',
  })
  @Column({
    type: 'enum',
    enum: AvailableLanguages,
    default: AvailableLanguages['de-DE'],
  })
  @Index()
  language!: AvailableLanguages;

  @ApiProperty({
    description:
      'Some default ordering, in case there is no automatic ordering for an article, no need in the frontend.',
    type: 'integer',
    format: 'int64',
  })
  @Column({
    default: 100,
  })
  defaultOrder?: number;
}
