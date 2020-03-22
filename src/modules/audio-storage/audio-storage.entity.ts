import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({
  name: 'audio-file',
})
export class AudioFile {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  created!: Date;

  @Column({
    nullable: true,
  })
  uploaded!: Date;

  @Column({
    length: 255,
    nullable: true,
  })
  path!: string;

  @Column({
    default: false,
  })
  isUploaded!: boolean;

  @Column({
    default: false,
  })
  translated!: boolean;
}
