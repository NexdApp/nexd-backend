import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from 'modules/user/user.entity';

@Entity({
  name: 'helpers',
})
export class Helper {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(type => User, { cascade: true })
  @JoinColumn()
  user!: User;
}
