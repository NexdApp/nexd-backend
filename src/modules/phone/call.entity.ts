import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HelpRequest } from '../helpRequests/help-request.entity';

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

  // URL of the recorded audio file
  @Exclude()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  recordUrl?: string;

  // URL to a textfile containing the automatic transcribtion of the call
  @Exclude()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  transcriptionUrl?: string;

  // not null if converted
  @OneToOne(type => HelpRequest)
  @JoinColumn()
  convertedHelpRequest?: HelpRequest;

  // the phonenumber of the caller if provided
  @Exclude()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  phoneNumber?: string;

  // origin country of the call
  @Column({
    type: 'varchar',
    nullable: true,
  })
  country?: string;

  // zip code of the calls origin
  @Column({
    type: 'varchar',
    nullable: true,
  })
  zip?: string;

  // city associated with the zip code
  @Column({
    type: 'varchar',
    nullable: true,
  })
  city?: string;
}
