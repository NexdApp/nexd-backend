import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly name!: string;
}
