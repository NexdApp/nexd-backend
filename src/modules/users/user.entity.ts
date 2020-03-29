// import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { PasswordTransformer } from './password.transformer';
import { UserRole } from './user-role';
import { ApiProperty } from '@nestjs/swagger';
import { AddressModel } from '../../models/address.model';

@Entity({
  name: 'users',
})
export class User extends AddressModel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ required: true })
  @Column({ length: 255 })
  firstName!: string;

  @ApiProperty({ required: true })
  @Column({ length: 255 })
  lastName!: string;

  @ApiProperty({ required: true })
  @Column({ length: 255 })
  email!: string;

  @ApiProperty({ required: true })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.NONE,
  })
  role!: string;

  @ApiProperty({ required: false })
  @Column({
    length: 255,
    nullable: true,
  })
  telephone?: string;

  @Column({
    name: 'password',
    length: 255,
    transformer: new PasswordTransformer(),
  })
  // @Exclude()
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

export class UserID {
  userId!: string;
}
