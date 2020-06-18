import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { HelpRequest } from './help-request.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Article } from '../articles/article.entity';
import { Exclude } from 'class-transformer';
import { Unit } from '../articles/unit.entity';

@Entity({
  name: 'helpRequestArticle',
})
export class HelpRequestArticle {
  @ApiProperty({
    type: 'integer',
    format: 'int64',
  })
  @PrimaryGeneratedColumn()
  @Exclude() // nobody needs to know the relation id
  id?: number;

  @ApiProperty({
    type: 'integer',
    format: 'int64',
  })
  @Column({ nullable: true })
  articleId?: number;

  @ManyToOne(type => Article)
  @JoinColumn({ name: 'articleId' })
  article?: Article;

  @ApiProperty({
    type: 'integer',
    format: 'int64',
  })
  @Column({ nullable: true })
  unitId?: number;

  @ManyToOne(type => Unit)
  @JoinColumn({ name: 'unitId' })
  unit?: Unit;

  @ApiProperty({
    type: 'integer',
    format: 'int64',
  })
  @Column()
  articleCount?: number;

  @Column({ default: false })
  articleDone?: boolean;

  @ManyToOne(
    type => HelpRequest,
    helpRequest => helpRequest.articles,
  )
  helpRequest?: HelpRequest;
}
