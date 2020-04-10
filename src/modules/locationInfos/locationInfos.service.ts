import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationInfo } from './locationInfo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocationInfosService {
  constructor(
    @InjectRepository(LocationInfo)
    private readonly localInfoRepo: Repository<LocationInfo>,
  ) { }

  /**
   * Returns local info connected to one or multiple of the parameters
   * 
   * @param city 
   * @param country
   * @param zip 
   * @param location 
   */
  async getLocationInfo(city?: string,
    country?: string,
    zip?: string,
    location?: { longitude: number, latitude: number }): Promise<LocationInfo> {

    const query = this.localInfoRepo.createQueryBuilder();

    if (city)
      query.andWhere("LocationInfo.city = :city", { city: city });
    if (country)
      query.andWhere("LocationInfo.city = :city", { country: country });
    if (zip)
      query.andWhere("LocationInfo.zip = :zip", { zip: city });
    if (location) {
      query.andWhere("LocationInfo.latitude = :latitude", { latitude: location.latitude });
      query.andWhere("LocationInfo.longitude = :longitude", { longitude: location.longitude });
    }

    return await query.getOne();
  }

  /**
   * Returns all locations in the given radius from the given location 
   * 
   * @param radius 
   * @param location 
   */
  async getLocationsInRadius(radius: number, location: LocationInfo): Promise<LocationInfo[]> {
    return await this.localInfoRepo.query(` SELECT zip, country, city, state, "stateShort", area, ST_AsGeoJSON(location)::json AS "location" FROM "locationInfos" WHERE ST_DWITHIN(location, 
                                            ST_MakePoint(${location.location.coordinates[0]}, ${location.location.coordinates[1]})::geography, ${radius} );`);
  }
}
