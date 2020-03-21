import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { RequestArticle } from './requestArticle.entity';

@Entity({
  name: 'request',
})
export class Request {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  requester!: number;

  @OneToMany(
    type => RequestArticle,
    requestArticle => requestArticle.request,
    { cascade: true },
  )
  articles!: RequestArticle[];
}

export class RequestFillableFields {
  requester!: number;
}
