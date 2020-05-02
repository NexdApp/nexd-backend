import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AvailableLanguages } from 'src/constants/languages';
import { Article } from './article.entity';

@Entity({
  name: 'categories',
})
export class Category {
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
  @Column({
    type: 'enum',
    enum: AvailableLanguages,
    default: AvailableLanguages['de-DE'],
  })
  language!: AvailableLanguages;

  @OneToMany(
    type => Article,
    article => article.category,
    { cascade: true },
  )
  articles?: Article[];
}
