import { Column } from 'typeorm';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AddressModel {
  @ApiPropertyOptional()
  @Column({ length: 255, nullable: true })
  firstName?: string;

  @ApiPropertyOptional()
  @Column({ length: 255, nullable: true })
  lastName?: string;

  @ApiPropertyOptional()
  @Column({
    length: 100,
    nullable: true,
  })
  street?: string;

  @ApiPropertyOptional()
  @Column({
    length: 100,
    nullable: true,
  })
  number?: string;

  @ApiPropertyOptional()
  @Column({
    length: 10,
    nullable: true,
  })
  zipCode?: string;

  @ApiPropertyOptional()
  @Column({
    length: 100,
    nullable: true,
  })
  city?: string;
}
