import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Request } from './request.entity';

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

  @ManyToOne(
    type => Request,
    request => request.articles,
  )
  request?: Request;
}

export class RequestFillableFields {
  requester!: number;
}
