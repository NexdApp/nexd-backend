import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { HelpListStatus } from './help-list-status';
import { HelpRequest } from '../helpRequests/help-request.entity';
import { User } from '../users/user.entity';

@Entity({
  name: 'helpList',
})
export class HelpList {
  @ApiProperty({ type: 'long' })
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  ownerId!: string;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'ownerId' })
  owner!: User;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  @UpdateDateColumn()
  updated_at!: Date;

  @Column({
    enum: HelpListStatus,
    type: 'enum',
    default: HelpListStatus.ACTIVE,
  })
  status?: HelpListStatus = HelpListStatus.ACTIVE;

  @OneToMany(
    type => HelpRequest,
    helpRequest => helpRequest.helpList,
    { cascade: true },
  )
  @JoinColumn({ name: 'helpRequestsIds' })
  helpRequests!: HelpRequest[];

  @RelationId((helpList: HelpList) => helpList.helpRequests)
  helpRequestsIds!: number[];
}

export class HelpListsFillableFields {
  owner!: number;
}
