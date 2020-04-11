import { ApiProperty } from '@nestjs/swagger';
import { HttpConflictErrors } from './httpConflictErrors.type';

export class HttpConflictResponse {
  @ApiProperty({
    type: 'integer',
    format: 'int64',
    example: 409,
  })
  statusCode? = 409;

  @ApiProperty({
    description: 'Specific error code from enum',
    enum: HttpConflictErrors,
  })
  errorCode!: HttpConflictErrors;

  @ApiProperty()
  errorDescription?: string;
}
