import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HelpRequest } from './help-request.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Article } from '../articles/article.entity';
import { Exclude } from 'class-transformer';

@Entity({
  name: 'helpRequestArticle',
})
export class HelpRequestArticle {
  @PrimaryGeneratedColumn()
  @Exclude() // nobody needs to know the relation id
  id!: number;

  @ApiProperty({
    type: 'integer',
    format: 'int64',
  })
  @Column({ nullable: true })
  articleId!: number;

  @ManyToOne(type => Article)
  @JoinColumn({ name: 'articleId' })
  article!: Article;

  @ApiProperty({
    type: 'integer',
    format: 'int64',
  })
  @Column()
  articleCount!: number;

  @Column({ default: false })
  articleDone!: boolean;

  @ManyToOne(
    type => HelpRequest,
    helpRequest => helpRequest.articles,
  )
  helpRequest!: HelpRequest;
}
