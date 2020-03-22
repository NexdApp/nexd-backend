import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'class-validator';

export class UploadCallPayloadDto {
  @ApiProperty({
    required: true,
    description: 'The ID of the uploaded audio file',
  })
  @IsString()
  readonly audio_id!: string;

  @ApiProperty({
    required: true,
    description: 'Date of file upload'
  })
  @IsString()
  readonly upload_date!: string;

  @ApiProperty({
    required: true,
    description: 'Filesystem path of the audio file'
  })
  @IsString()
  readonly path!: string;

  @ApiProperty({
    required: true,
    description: 'Mark if audio file translation is finished'
  })
  @IsBoolean()
  readonly translated!: boolean;
}
