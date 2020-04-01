import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
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

  @ApiProperty({ type: 'long' })
  @Column({ nullable: true })
  articleId: number;

  @OneToOne(type => Article)
  @JoinColumn({ name: 'articleId' })
  article!: Article;

  @ApiProperty({ type: 'integer' })
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
