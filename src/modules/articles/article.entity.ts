import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AvailableLanguages } from '../../constants/languages';
import { Category } from './category.entity';
import { ArticleStatus } from './article-status';

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
  @Column({ length: 255 })
  name!: string;

  @ApiProperty({
    description: 'Language key of this article',
    enum: AvailableLanguages,
  })
  @Column({
    type: 'enum',
    enum: AvailableLanguages,
    default: AvailableLanguages['de-DE'],
  })
  @Index()
  language!: AvailableLanguages;

  @Column({
    type: 'enum',
    enum: ArticleStatus,
    default: ArticleStatus.ACTIVE,
  })
  @Index()
  status?: ArticleStatus;

  @Column({ default: false })
  @ApiProperty({
    description:
      'The article status can be enforced by an admin (e.g. to remove profanity).',
  })
  statusOverwritten?: boolean = false;

  @Column({ type: 'int', default: 0 })
  @Index()
  @ApiProperty({
    description:
      'Popularity of the article, the higher the more frequent used.',
    type: 'integer',
    format: 'int64',
  })
  popularity: number;

  // an array of unit ids, calculated by cron
  @Column({ type: 'int', array: true })
  @ApiProperty({
    description:
      'Determined order of the units. If the array is empty, there is no order yet identified.',
    type: 'array',
    items: {
      type: 'integer',
      format: 'int64',
    },
  })
  unitIdOrder?: number[] = [];

  @ApiProperty({
    type: 'integer',
    format: 'int64',
  })
  @Column({ nullable: true })
  categoryId?: number;

  @ManyToOne(type => Category)
  @JoinColumn({ name: 'categoryId' })
  category?: Category;
}
