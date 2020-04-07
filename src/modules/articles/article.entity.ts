import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'articles',
})
export class Article {
  @ApiProperty({
    description: 'Auto-incremented ID of an article.',
    type: 'integer',
    format: 'int64',
  })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({
    description: 'Name of the article, should also contain the unit.',
  })
  @Column({ length: 255 })
  name!: string;
}
