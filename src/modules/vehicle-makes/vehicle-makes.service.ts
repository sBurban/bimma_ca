import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { XmlUtilsService } from 'src/common/services/XmlUtils/XmlUtilsl.service';
import type { XmlVehicleMakeEntity, XmlAllVehicleMakes, XmlToJsonFormatResponse } from 'src/common/services/XmlUtils/XmlUtilsl';
import { XML_FIND_ALL, XML_FIND_MAKEID } from 'src/common/constants/xml_uris.constants';

import { InjectModel } from '@nestjs/sequelize';
import { Sequelize as TSsequelize } from 'sequelize-typescript';

import { VehicleMakes } from './models/vehicle_makes.model';
import { VehicleMakeTypes } from '../vehicle-make-types/models/vehicle_make_types.model';
import { VehicleMakeTypesService } from '../vehicle-make-types/vehicle-make-types.service';

@Injectable()
export class VehicleMakesService {
  constructor(
    public sequelize: TSsequelize,
    @InjectModel(VehicleMakes) private vehicleMakeModel: typeof VehicleMakes,
    private readonly httpService: HttpService,
    private vecMakeTypeService: VehicleMakeTypesService,
    private xmlUtilsService: XmlUtilsService,
  ) {}

  async initTableRows(allVehicleMakes: XmlVehicleMakeEntity[]) {
    const BULK_SIZE = 500;
    const transaction = await this.sequelize.transaction();

    try {
      for (let i = 0; i < allVehicleMakes.length; i += BULK_SIZE) {
        const batch = [];
        for (let j = i; j < i + BULK_SIZE; j++) {
          if (!allVehicleMakes[j]) break;
          const obj = allVehicleMakes[j];
          batch.push({ make_id: obj.Make_ID, make_name: obj.Make_Name });
        }
        // Work on Batch Here
        console.log(`Batch[${i}]: ${i} to ${i + batch.length - 1} `);
        await this.vehicleMakeModel.bulkCreate(batch, {
          transaction,
          validate: false,
          returning: false,
        });
      }
      await transaction.commit();
      console.log("All records inserted correctly");
    } catch (error) {
      // Rolls back everything
      await transaction.rollback();
      console.error('Bulk insertion failed, transaction rolled back:', error);
    }
  }

  async findOne(makeId: number): Promise<VehicleMakes> {
    if (makeId) {
      const jObj = await this.xmlUtilsService.getXML(XML_FIND_MAKEID(makeId));
      return jObj;
    }
    const vecMake = await this.vehicleMakeModel.findOne({
      where: {
        make_id: makeId,
      },
      // include: [{ model: VehicleMakeTypes }],
      include: [{ model: VehicleMakeTypes, required: true }],
    });
    // console.log("🚀 ~ VehicleMakesService ~ findOne ~ vecMake:", vecMake)
    if (!vecMake) {
      throw new NotFoundException(`VehicleMake with ID ${makeId} not found`);
    }
    if (!vecMake) {
      // this.vecMakeTypeService
    }

    return vecMake;
  }

  async findAll(limit: number, page: number): Promise<VehicleMakes[]> {
    const check_records_exist = await this.vehicleMakeModel.count();
    console.log("🚀 ~ VehicleMakesService ~ findAll ~ check_records_exist:", check_records_exist, typeof check_records_exist)
    if (check_records_exist == 0) {
      console.log("Fetching source XML file.")
      const jObj: XmlToJsonFormatResponse<XmlAllVehicleMakes> =
        await this.xmlUtilsService.getXML(XML_FIND_ALL); console.log("Initializing Database Records.")
      await this.initTableRows(jObj.Response.Results.AllVehicleMakes);
      console.log("Table has been populated. Ready for querying")
    }

    const vecMakes = await this.vehicleMakeModel.findAll({
      // where: {
      //   make_id: id
      // },
      limit: limit == 0 ? undefined : limit,
      offset: limit == 0 ? undefined : page * 1000,
    });
    return vecMakes;
  }
}
