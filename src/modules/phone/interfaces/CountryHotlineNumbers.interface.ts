import { HotlineNumber } from './HotlineNumber.interface';

export interface CountryHotlineNumbers {
  [countryCode: string]: HotlineNumber[];
}

export const countryHotlineNumberExample: CountryHotlineNumbers = {
  DE: [
    {
      language: 'de-DE',
      comment: 'First hotline in germany',
      number: '+49 721 98419016',
    },
  ],
};
