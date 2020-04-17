import { ApiProperty } from '@nestjs/swagger';

export class PhoneNumberDto {
  @ApiProperty({
    example: 'de-DE',
  })
  language: string;

  @ApiProperty({
    example: 'DE',
  })
  country: string;

  @ApiProperty({
    example: 'First hotline',
  })
  comment: string;

  @ApiProperty({
    example: '+49 721 98419016',
    description: 'Valid phonenumber for libphonenumber',
  })
  number: string;

  constructor(
    language: string,
    country: string,
    comment: string,
    number: string,
  ) {
    this.language = language;
    this.country = country;
    this.comment = comment;
    this.number = number;
  }
}
