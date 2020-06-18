import { Unit } from '../modules/articles/unit.entity';
import { AvailableLanguages } from '../constants/languages';

export const Units2Seed: Unit[] = [
  {
    nameZero: 'Packungen',
    nameOne: 'Packung',
    nameTwo: 'Packungen',
    nameFew: 'Packungen',
    nameMany: 'Packungen',
    nameOther: 'Packungen',
    nameShort: 'Pkg.',
    language: AvailableLanguages.de,
    defaultOrder: 10,
  },
  {
    nameZero: 'package',
    nameOne: 'package',
    nameTwo: 'packages',
    nameFew: 'packages',
    nameMany: 'packages',
    nameOther: 'packages',
    nameShort: 'pg.',
    language: AvailableLanguages.en,
    defaultOrder: 10,
  },
];
