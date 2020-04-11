import { AddressModel } from '../../../models/address.model';
import { UserRole } from '../user-role';
import { IsPhoneNumber, IsOptional } from 'class-validator';

export class UpdateUserDto extends AddressModel {
  firstName!: string;

  lastName!: string;

  role?: UserRole = UserRole.NONE;

  @IsOptional()
  @IsPhoneNumber('ZZ')
  phoneNumber?: string;
}
