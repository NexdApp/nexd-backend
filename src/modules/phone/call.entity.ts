import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { HelpRequest } from '../helpRequests/help-request.entity';
import { User } from '../users/user.entity';

@Entity({
  name: 'calls',
})
export class Call {
  // Session id of the call
  @PrimaryColumn()
  sid!: string;

  // Timestamp of start  of the call
  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  recordingUrl?: string;

  // not null if converted
  @OneToOne(
    type => HelpRequest,
    convertedHelpRequest => convertedHelpRequest.call,
    { cascade: true },
  )
  convertedHelpRequest?: HelpRequest;

  // the phonenumber of the caller if provided
  @Exclude()
  @Column({
    nullable: true,
  })
  phoneNumber?: string;

  // origin country of the call
  @Column({
    nullable: true,
  })
  country?: string;

  // zip code of the calls origin
  @Column({
    nullable: true,
  })
  zip?: string;

  // city associated with the zip code
  @Column({
    nullable: true,
  })
  city?: string;

  @Column({ nullable: true })
  converterId: string;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'converterId' })
  converter?: User;
}
