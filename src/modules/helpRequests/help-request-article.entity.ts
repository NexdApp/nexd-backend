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

  @ApiProperty({ type: 'integer' })
  @Column({ nullable: true })
  articleId: number;

  @ApiProperty({ required: true })
  @OneToOne(type => Article)
  @JoinColumn({ name: 'articleId' })
  article!: Article;

  @ApiProperty({ required: true })
  @Column()
  articleCount!: number;

  @ApiProperty({ required: true })
  @Column({ default: false })
  articleDone!: boolean;

  @ManyToOne(
    type => HelpRequest,
    helpRequest => helpRequest.articles,
  )
  helpRequest!: HelpRequest;
}
