// import { IsNotEmpty } from 'class-validator';
import { AddressModel } from '../../../models/address.model';
import { UserRole } from '../user-role';

export class UpdateUserDto extends AddressModel {
  // @IsNotEmpty()
  firstName!: string;

  // @IsNotEmpty()
  lastName!: string;

  // @IsNotEmpty()
  role?: UserRole = UserRole.NONE;

  telephone?: string;
}
