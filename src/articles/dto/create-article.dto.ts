import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({
    required: true,
    description: 'Name of the article, should also contain the unit.',
  })
  @IsString()
  readonly name!: string;
}
