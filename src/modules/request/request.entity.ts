import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity({
  name: 'request',
})
export class Request {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @CreateDateColumn()
  created_at!: Date;

  @Column()
  requester!: number;
}

export class RequestFillableFields {
  requester!: number;
}
