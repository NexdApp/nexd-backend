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
    default: ArticleStatus.VERIFIED, // TODO change to ACTIVE later
  })
  @Index()
  status?: ArticleStatus;

  // an array of unit ids, calculated by cron
  @Column({ type: 'int', array: true, default: () => 'array[]::integer[]' })
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
