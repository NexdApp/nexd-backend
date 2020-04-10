import {
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity({
  name: 'locationInfos',
})
export class LocationInfo {
  @Column({
    type: "varchar"
  })
  zip!: string;

  @Column({
    type: "varchar"
  })
  country!: string;

  @Column({
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

  @PrimaryColumn({
    type: 'geography',
    spatialFeatureType: "Point",
    nullable: false,
  })
  location: { type: string, coordinates: number[] };
}
