import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'articles',
})
export class Article {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;
}

export class ArticleFillableFields {
  name!: string;
}
