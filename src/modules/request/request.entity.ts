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

  @Column({
    name: 'priority',
    type: 'enum',
    default: 'low',
    enum: ['low', 'medium', 'high'],
  })
  priority?: string;

  @Column()
  additionalRequest?: string;

  @Column()
  address?: string;

  @Column()
  zipCode?: string;

  @Column()
  city?: string;

  @Column()
  deliveryComment?: string;

  @Column({
    length: 255,
    nullable: true,
  })
  phoneNumber?: string;

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
