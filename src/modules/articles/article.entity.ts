import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AvailableLanguages } from 'src/constants/languages';
import { Category } from './category.entity';

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

  @Column({ default: false })
  @Index()
  activated!: boolean;

  @Column({ type: 'int', array: true })
  unitOrder: number[];

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
