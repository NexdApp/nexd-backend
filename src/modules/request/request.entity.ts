import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { RequestArticle } from './requestArticle.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'request',
})
export class Request {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @ApiProperty({ type: 'integer' })
  @Column()
  requester!: number;

  @ApiProperty()
  @Column({
    name: 'priority',
    type: 'enum',
    default: 'low',
    enum: ['low', 'medium', 'high'],
  })
  priority?: string;

  @ApiProperty()
  @Column({ nullable: true })
  additionalRequest?: string;

  @ApiProperty()
  @Column()
  address?: string;

  @ApiProperty()
  @Column()
  zipCode?: string;

  @ApiProperty()
  @Column()
  city?: string;

  @ApiProperty()
  @Column({ nullable: true })
  deliveryComment?: string;

  @ApiProperty()
  @Column({
    length: 255,
    nullable: true,
  })
  phoneNumber?: string;

  @ApiProperty({ type: [RequestArticle] })
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
