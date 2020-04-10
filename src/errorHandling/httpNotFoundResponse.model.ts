import { ApiProperty } from '@nestjs/swagger';
import { HttpNotFoundErrors } from './httpNotFoundErrors.type';

export class HttpNotFoundResponse {
  @ApiProperty({
    type: 'integer',
    format: 'int64',
    example: 404,
  })
  statusCode? = 404;

  @ApiProperty({
    description: 'Specific error code from enum',
    enum: HttpNotFoundErrors,
  })
  errorCode!: HttpNotFoundErrors;

  @ApiProperty()
  errorDescription?: string;
}
