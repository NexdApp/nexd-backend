import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'modules/user/user.entity';

@Entity({
  name: 'seekers',
})
export class Seeker {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(type => User, { cascade: true })
  @JoinColumn()
  user!: User;
}
