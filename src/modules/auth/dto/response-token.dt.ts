import { ApiProperty } from '@nestjs/swagger';

export class ResponseTokenDto {
  @ApiProperty({
    description: 'seconds until expiration',
    type: 'integer',
  })
  expiresIn!: number;

  @ApiProperty({
    description: 'jwt token',
  })
  accessToken!: string;

  @ApiProperty({
    description: 'user id',
    type: 'integer',
  })
  id!: number;
}
