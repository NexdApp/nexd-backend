import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

import { UserRole } from './user-role';
import { AddressModel } from '../../models/address.model';
import * as bcrypt from 'bcrypt';
import { ApiHideProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsOptional } from 'class-validator';

@Entity({
  name: 'users',
})
export class User extends AddressModel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  email!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.NONE,
  })
  role?: UserRole = UserRole.NONE;

  @Column({
    length: 255,
    nullable: true,
  })
  @IsOptional()
  @IsPhoneNumber('ZZ')
  phoneNumber?: string;

  @ApiHideProperty()
  @Column()
  @Exclude()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }
}

export class UserID {
  userId!: string;
}
