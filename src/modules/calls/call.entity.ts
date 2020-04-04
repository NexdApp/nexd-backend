import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity({
  name: 'call',
})
export class Call {
  // Session id of the call
  @PrimaryColumn()
  sid!: string;

  // Timestamp of start  of the call
  @CreateDateColumn()
  created!: Date;

  // State of the recording of the call, only set when the call was finished stored 
  @Column({
    type: "boolean",
    nullable: false,
    default: false
  })
  recorded!: boolean;

  // URL of the recorded audio file 
  @Exclude()
  @Column({
    type: "varchar",
    nullable: true
  })
  recordUrl?: string;

  // State of the automatic transcribtion
  @Column({
    type: "boolean",
    nullable: false,
    default: false
  })
  transcribed!: boolean;

  // URL to a textfile containing the automatic transcribtion of the call
  @Exclude()
  @Column({
    type: "varchar",
    nullable: true
  })
  transcriptionUrl?: string;

  // Marks if call was already converted to an shopping list
  @Column({
    type: "boolean",
    nullable: false,
    default: false
  })
  converted!: boolean;

  // the phonenumber of the caller if provided 
  @Exclude()
  @Column({
    type: "varchar",
    nullable: true
  })
  phoneNumber?: string;

  // origin country of the call
  @Column({
    type: "varchar",
    nullable: true
  })
  country?: string;

  // zip code of the calls origin
  @Column({
    type: "int",
    nullable: true
  })
  zip?: number;

  // city associated with the zip code
  @Column({
    type: "varchar",
    nullable: true
  })
  city?: string;
}
