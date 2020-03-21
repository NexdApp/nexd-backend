import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { PasswordTransformer } from './password.transformer';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  firstName!: string;

  @Column({ length: 255 })
  lastName!: string;

  @Column({ length: 255 })
  email!: string;

  @Column({
    nullable: true,
    name: 'role',
    type: 'enum',
    nullable: true,
    enum: ['helper', 'seeker'],
  })
  role?: string;

  @Column({
    length: 255,
    nullable: true,
  })
  telephone?: string;

  @Column({
    length: 10,
    nullable: true,
  })
  address?: string;

  @Column({
    name: 'password',
    length: 255,
    transformer: new PasswordTransformer(),
  })
  @Exclude()
  password!: string;
}

export class UserFillableFields {
  email!: string;
  firstName!: string;
  lastName!: string;
  role?: string;
  telephone?: string;
  address?: string;
  password!: string;
}
