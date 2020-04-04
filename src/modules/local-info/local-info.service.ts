import { Injectable, OnModuleInit } from '@nestjs/common';

//import * as LOCAL_INFO from "./data/DE.json"
import { LocalInfo } from './local-info.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LocalInfoService implements OnModuleInit {
  constructor(
    @InjectRepository(LocalInfo)
    private readonly localInfoRepo: Repository<LocalInfo>,
  ){}

  async onModuleInit(){
    // TODO: efficient strategy to migrate data from files to database
    /*LOCAL_INFO.local_infos.forEach(async (local_info : LocalInfo) => {
      await this.localInfoRepo.save(local_info);
    });*/
  }

  /**
   * Returns local info connected to one or multiple of the parameters
   * 
   * @param city 
   * @param zip 
   * @param location 
   */
  async getLocalInfo( city?: string, 
                      zip?: string, 
                      location?: {longitude: number, latitude: number}){

    let query = this.localInfoRepo.createQueryBuilder();

    if(city)
      query.andWhere("LocalInfo.city = :city", {city: city});
    if(zip)
      query.andWhere("LocalInfo.zip = :zip", {zip: city});
    if(location){
      // TODO: implement something that finds the nearest city to this point
    }
      
    return await query.getOne();
  }
}
