// import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

import { UserRole } from './user-role';
import { ApiProperty } from '@nestjs/swagger';
import { AddressModel } from '../../models/address.model';
import * as bcrypt from 'bcrypt';

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

  @Column()
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
