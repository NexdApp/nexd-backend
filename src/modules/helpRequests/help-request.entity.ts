import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { HelpRequestArticle } from './help-request-article.entity';
import { ApiProperty } from '@nestjs/swagger';
import { HelpRequestStatus } from './help-request-status';
import { AddressModel } from '../../models/address.model';
import { User } from '../users/user.entity';

@Entity({
  name: 'helpRequest',
})
export class HelpRequest extends AddressModel {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column()
  @CreateDateColumn()
  created_at!: Date;

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
    enum: HelpRequestStatus,
    default: HelpRequestStatus.PENDING,
    type: HelpRequestStatus,
  })
  @Column({
    type: 'enum',
    enum: HelpRequestStatus,
    default: HelpRequestStatus.PENDING,
  })
  status!: string;

  @ApiProperty({ type: [HelpRequestArticle] })
  @OneToMany(
    type => HelpRequestArticle,
    helpRequestArticle => helpRequestArticle.helpRequest,
    { cascade: true },
  )
  articles!: HelpRequestArticle[];

  @ApiProperty()
  @Column({ nullable: true })
  requesterId: string;

  @ApiProperty({ type: User })
  @ManyToOne(type => User)
  @JoinColumn({ name: 'requesterId' })
  requester!: User;
}

export class RequestFillableFields {
  requesterId!: number;
}
