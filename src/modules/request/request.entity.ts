import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RequestArticle } from './requestArticle.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RequestStatus } from './request-status';
import { AddressModel } from '../main/models/address.model';
import { User } from '../user/user.entity';
import { Exclude } from 'class-transformer';

@Entity({
  name: 'request',
})
export class RequestEntity extends AddressModel {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @ApiProperty({ type: 'integer' })
  @Column()
  requesterId!: number;

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
  @Column({ nullable: true })
  deliveryComment?: string;

  @ApiProperty()
  @Column({
    length: 255,
    nullable: true,
  })
  phoneNumber?: string;

  @ApiProperty({
    enum: RequestStatus,
    default: RequestStatus.PENDING,
    type: RequestStatus,
  })
  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.PENDING,
  })
  status!: string;

  @ApiProperty({ type: [RequestArticle] })
  @OneToMany(
    type => RequestArticle,
    requestArticle => requestArticle.request,
    { cascade: true },
  )
  articles!: RequestArticle[];

  @ApiPropertyOptional({ type: User })
  @Exclude()
  requester!: User;
}

export class RequestFillableFields {
  requesterId!: number;
}
