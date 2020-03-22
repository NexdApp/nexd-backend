import {Exclude} from 'class-transformer';
import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn} from 'typeorm';


@Entity({
  name: 'audio-file',
})
export class AudioFile {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  @Column({length: 255})
  upload_date!: string;

  @Column({length: 255})
  path!: string;

  @Column()
  uploaded!: boolean;

  @Column()
  translated!: boolean;
}
