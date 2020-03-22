import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Request} from './request.entity';

@Entity({
  name: 'requestArticle',
})
export class RequestArticle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  articleId!: number;

  @Column()
  articleCount!: number;

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
