import { ApiProperty } from '@nestjs/swagger';
import { BackendErrors } from './backendErrors.type';

export class BackendErrorEntry {
  @ApiProperty({
    description: 'Specific error code from enum',
    enum: BackendErrors,
  })
  errorCode?: BackendErrors;
  @ApiProperty()
  errorDescription: string;
}

export class BackendErrorResponse {
  @ApiProperty({
    type: 'integer',
    format: 'int64',
    example: 400,
  })
  statusCode? = 400;

  @ApiProperty({
    type: BackendErrorEntry,
    isArray: true,
  })
  errors!: BackendErrorEntry[];
}
