import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { HelpRequestArticle } from './help-request-article.entity';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { HelpRequestStatus } from './help-request-status';
import { AddressModel } from '../../models/address.model';
import { User } from '../users/user.entity';
import { HelpList } from '../helpLists/help-list.entity';
import { Call } from '../phone/call.entity';
import { Exclude } from 'class-transformer';

@Entity({
  name: 'helpRequests',
})
export class HelpRequest extends AddressModel {
  @ApiProperty({
    type: 'integer',
    format: 'int64',
  })
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  @CreateDateColumn()
  created_at?: Date;

  @Column({
    name: 'priority',
    type: 'enum',
    default: 'low',
    enum: ['low', 'medium', 'high'],
  })
  priority?: string;

  @Column({ nullable: true })
  additionalRequest?: string;

  @Column({ nullable: true })
  deliveryComment?: string;

  @Column({
    length: 255,
    nullable: true,
  })
  phoneNumber?: string;

  @Column({
    type: 'enum',
    enum: HelpRequestStatus,
    default: HelpRequestStatus.PENDING,
  })
  status?: HelpRequestStatus;

  @OneToMany(
    type => HelpRequestArticle,
    helpRequestArticle => helpRequestArticle.helpRequest,
    { cascade: true },
  )
  articles?: HelpRequestArticle[];

  @Column({ nullable: true })
  requesterId?: string;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'requesterId' })
  requester?: User;

  @ApiProperty({
    type: 'integer',
    format: 'int64',
  })
  @Column({ nullable: true })
  helpListId?: number;

  @ManyToOne(
    type => HelpList,
    helpList => helpList.helpRequests,
  )
  @JoinColumn({ name: 'helpListId' })
  helpList?: HelpList;

  @Column({ nullable: true })
  callSid?: string;

  // TODO: There is an issue, that swift can not deal with the
  // recursive one-to-one relation and therefore the id is exposed, but
  // not the call itself to stop recursion.
  @ApiHideProperty()
  @OneToOne(
    type => Call,
    call => call.convertedHelpRequest,
  )
  @JoinColumn({ name: 'callSid' })
  call?: Call;
}
