import { ApiProperty } from '@nestjs/swagger';
import { HttpBadRequestErrors } from './httpBadRequestErrors.type';

export class BadRequestErrorEntry {
  @ApiProperty({
    description: 'Specific error code from enum',
    enum: HttpBadRequestErrors,
  })
  errorCode?: HttpBadRequestErrors;
  @ApiProperty()
  errorDescription: string;
}

export class HttpBadRequestResponse {
  @ApiProperty({
    type: 'integer',
    format: 'int64',
    example: 400,
  })
  statusCode? = 400;

  @ApiProperty({
    type: BadRequestErrorEntry,
    isArray: true,
  })
  errors!: BadRequestErrorEntry[];
}
