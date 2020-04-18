import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AvailableLanguages } from 'src/constants/languages';

@Entity({
  name: 'categories',
})
export class Article {
  @ApiProperty({
    description: 'Auto-incremented ID of an category.',
    type: 'integer',
    format: 'int64',
  })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({
    description: 'Category name',
  })
  @Column()
  name!: string;

  @ApiProperty({
    description: 'Language key of this category',
  })
  @Column({ type: 'enum', enum: AvailableLanguages })
  language!: AvailableLanguages;
}
