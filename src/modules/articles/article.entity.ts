import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';
import { AvailableLanguages } from 'src/constants/languages';

@Entity({
  name: 'articles',
})
export class Article {
  @ApiProperty({
    description: 'Auto-incremented ID of an article.',
    type: 'integer',
    format: 'int64',
  })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({
    description: 'Name of the article (without unit)',
  })
  @Column()
  name!: string;

  @ApiProperty({
    description: 'Language key of this article',
  })
  @Column({
    type: 'enum',
    enum: AvailableLanguages,
    default: AvailableLanguages['de-DE'],
  })
  @Index()
  language!: AvailableLanguages;
}
