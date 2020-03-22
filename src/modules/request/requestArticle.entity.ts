import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Request} from './request.entity';
import {ApiProperty} from '@nestjs/swagger';

@Entity({
  name: 'requestArticle',
})
export class RequestArticle {
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({required: true})
  @Column()
  articleId!: number;

  @ApiProperty({required: true})
  @Column()
  articleCount!: number;

  @ApiProperty({required: true})
  @Column({default: false})
  articleDone!: boolean;

  @ManyToOne(
    type => Request,
    request => request.articles,
  )
  request!: Request;
}

export class RequestFillableFields {
  requester!: number;
}
