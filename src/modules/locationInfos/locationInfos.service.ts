import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationInfo } from './locationInfo.entity';
import { Repository } from 'typeorm';
import { LocationInfoQuery } from './dto/locationInfoQuery.dto';

@Injectable()
export class LocationInfosService {
  constructor(
    @InjectRepository(LocationInfo)
    private readonly localInfoRepo: Repository<LocationInfo>,
  ) {}

  /**
   * Returns local info connected to one or multiple of the parameters
   *
   * @param city
   * @param country
   * @param zip
   * @param location
   */
  async getLocationInfo(
    locationQuery: LocationInfoQuery,
  ): Promise<LocationInfo> {
    const query = this.localInfoRepo.createQueryBuilder();

    if (locationQuery.city)
      query.andWhere('LocationInfo.city = :city', { city: locationQuery.city });
    if (locationQuery.country)
      query.andWhere('LocationInfo.city = :city', {
        country: locationQuery.country,
      });
    if (locationQuery.zip)
      query.andWhere('LocationInfo.zip = :zip', { zip: locationQuery.city });
    if (locationQuery.location) {
      query.andWhere('LocationInfo.latitude = :latitude', {
        latitude: locationQuery.location.coordinates[0],
      });
      query.andWhere('LocationInfo.longitude = :longitude', {
        longitude: locationQuery.location.coordinates[1],
      });
    }

    return query.getOne();
  }

  /**
   * Returns all locations in the given radius from the given location
   *
   * @param radius
   * @param location
   */
  async getLocationsInRadius(
    radius: number,
    location: LocationInfo,
  ): Promise<LocationInfo[]> {
    return this.localInfoRepo
      .query(` SELECT zip, country, city, state, "stateShort", area, ST_AsGeoJSON(location)::json AS "location" FROM "locationInfos" WHERE ST_DWITHIN(location, 
                                            ST_MakePoint(${location.location.coordinates[0]}, ${location.location.coordinates[1]})::geography, ${radius} );`);
  }
}
