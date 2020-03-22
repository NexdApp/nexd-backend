import {Column} from 'typeorm';
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';

export class AddressModel {
  @ApiPropertyOptional()
  @Column({
    length: 10,
    nullable: true,
  })
  street?: string;

  @ApiPropertyOptional()
  @Column({
    length: 10,
    nullable: true,
  })
  number?: string;

  @ApiProperty()
  @Column({
    length: 10,
    nullable: true,
  })
  zipCode?: string;

  @ApiProperty()
  @Column({
    length: 10,
    nullable: true,
  })
  city?: string;
}
