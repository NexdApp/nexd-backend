import { ApiProperty } from '@nestjs/swagger';
import { HttpConflictErrors } from './httpConflictErrors.type';

export class ConflictErrorEntry {
  @ApiProperty({
    description: 'Specific error code from enum',
    enum: HttpConflictErrors,
  })
  errorCode?: HttpConflictErrors;
  @ApiProperty()
  errorDescription: string;
}

export class HttpConflictResponse {
  @ApiProperty({
    type: 'integer',
    format: 'int64',
    example: 409,
  })
  statusCode? = 409;

  @ApiProperty({
    type: ConflictErrorEntry,
    isArray: true,
  })
  errors!: ConflictErrorEntry[];
}
