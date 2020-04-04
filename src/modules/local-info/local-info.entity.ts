import {
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity({
  name: 'local-info',
})
export class LocalInfo {

  @Column({
    type: "varchar"
  })
  zip!: string;

  @Column({
    type: "varchar"
  })
  country!: string;

  @PrimaryColumn({
    type: "varchar"
  })
  city!: string;

  @Column({
    type: "varchar"
  })
  state!: string;

  @Column({
    type: "varchar"
  })
  stateShort!: string;

  @Column({
    type: "varchar"
  })
  area!: string;

  @Column({
    type: "real",
  })
  longitude!: number;

  @Column({
    type: "real",
  })
  latitude!: number;
}
