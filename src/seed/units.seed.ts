// seed used in UnitValues seed

import { Unit } from '../modules/articles/unit.entity';
import { AvailableLanguages } from 'src/constants/languages';

export const UnitsSeed: Unit[] = [
  {
    name: 'Stück',
    nameShort: 'St.',
    language: AvailableLanguages.de,
    defaultOrder: 10,
  },
  {
    name: 'Beutel',
    nameShort: 'Btl.',
    language: AvailableLanguages.de,
    defaultOrder: 10,
  },
  {
    name: 'Flasche',
    nameShort: 'Fl.',
    language: AvailableLanguages.de,
    defaultOrder: 10,
  },
  {
    name: 'Gramm',
    nameShort: 'g',
    language: AvailableLanguages.de,
    defaultOrder: 10,
  },
  {
    name: 'Kilogram',
    nameShort: 'kg',
    language: AvailableLanguages.de,
    defaultOrder: 10,
  },
  {
    name: 'Liter',
    nameShort: 'l',
    language: AvailableLanguages.de,
    defaultOrder: 10,
  },
  {
    name: 'Milliliter',
    nameShort: 'ml',
    language: AvailableLanguages.de,
    defaultOrder: 10,
  },
  {
    name: 'Karton',
    nameShort: 'Kt.',
    language: AvailableLanguages.de,
    defaultOrder: 10,
  },
  {
    name: 'Dose',
    nameShort: 'Do.',
    language: AvailableLanguages.de,
    defaultOrder: 10,
  },
  {
    name: 'Kasten',
    nameShort: 'Ka.',
    language: AvailableLanguages.de,
    defaultOrder: 10,
  },
  {
    name: 'Bündel',
    nameShort: 'Bü.',
    language: AvailableLanguages.de,
    defaultOrder: 10,
  },
];
