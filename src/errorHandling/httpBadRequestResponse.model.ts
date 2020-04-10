import { ApiProperty } from '@nestjs/swagger';

export class HttpBadRequestResponse {
  @ApiProperty({
    type: 'integer',
    format: 'int64',
    example: 400,
  })
  statusCode? = 400;

  @ApiProperty({ example: 'Bad Request' })
  error!: string;

  @ApiProperty({
    example: ['password must be longer than or equal to 8 characters'],
  })
  message!: string[];
}
