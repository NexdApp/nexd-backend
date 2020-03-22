import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RequestEntity } from './request.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'requestArticle',
})
export class RequestArticle {
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ required: true })
  @Column()
  articleId!: number;

  @ApiProperty({ required: true })
  @Column()
  articleCount!: number;

  @ApiProperty({ required: true })
  @Column({ default: false })
  articleDone!: boolean;

  @ManyToOne(
    type => RequestEntity,
    request => request.articles,
  )
  request!: RequestEntity;
}

export class RequestFillableFields {
  requester!: number;
}
