export class LocationInfoQuery {
  zip?: string;

  country?: string;

  city?: string;

  state?: string;

  stateShort?: string;

  area?: string;

  location?: { type: string; coordinates: number[] };
}
