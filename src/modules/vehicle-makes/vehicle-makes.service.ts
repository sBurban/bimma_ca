import { Injectable, NotFoundException } from '@nestjs/common';

import { XmlUtilsService } from 'src/common/services/XmlUtils/XmlUtilsl.service';
import type { XmlVehicleMakeEntity, XmlAllVehicleMakes, XmlToJsonFormatResponse } from 'src/common/services/XmlUtils/XmlUtilsl';
import { XML_FIND_ALL, XML_FIND_MAKEID } from 'src/common/constants/xml_uris.constants';

import { InjectModel } from '@nestjs/sequelize';
import { Sequelize as TSsequelize } from 'sequelize-typescript';
import type { FindAttributeOptions } from 'sequelize';

import { VehicleMakes } from './models/vehicle_makes.model';
import { VehicleMakeTypes } from '../vehicle-make-types/models/vehicle_make_types.model';
import { VehicleMakeTypesService } from '../vehicle-make-types/vehicle-make-types.service';

@Injectable()
export class VehicleMakesService {
  constructor(
    public sequelize: TSsequelize,
    @InjectModel(VehicleMakes) private vehicleMakeModel: typeof VehicleMakes,
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
    // Fetch extended object with Renamed Attributes
    const typeAttributes = [['vehicle_type_id', 'typeId'], ['vehicle_type_name', 'typeName']] as FindAttributeOptions;
    const makeAttributes = [['make_id', 'makeId'], ['make_name', 'makeName']] as FindAttributeOptions;
    const vecIncludeItem = {
      model: VehicleMakeTypes, required: true,
      attributes: typeAttributes,
    };
    const vecMakeOptions = {
      where: { make_id: makeId },
      attributes: makeAttributes,
      include: [vecIncludeItem],
    };
    const vecMake = await this.vehicleMakeModel.findOne(vecMakeOptions);
    console.log("🚀 ~ VehicleMakesService ~ findOne ~ vecMake:", !!vecMake)
    if (vecMake) return vecMake;

    // Create the "MakeType" records, then fetch the extended "VehicleMake" object.
    const added = await this.vecMakeTypeService.create({ makeId, skip: true });
    console.log('🚀 ~ vehicle_makes.service.ts:71 ~ VehicleMakesService ~ findOne ~ added:', !!added);
    if (added) {
      const vMake2 = await this.vehicleMakeModel.findOne(vecMakeOptions);
      console.log('🚀 ~ vehicle_makes.service.ts:74 ~ VehicleMakesService ~ findOne ~ vMake2:', !!vMake2);
      if (vMake2) return vMake2;
    }
    // Last Fail-Handler
    // If for some reason "vMake2" fails, load record with incomplete data.
    const newVecOptions = { ...vecMakeOptions, include: [{ ...vecIncludeItem, require: false }] }
    const vMake3 = await this.vehicleMakeModel.findOne(newVecOptions);
    console.log('🚀 ~ vehicle_makes.service.ts:80 ~ VehicleMakesService ~ findOne ~ vMake3:', !!vMake3);
    if (!vMake3) {
      throw new NotFoundException(`VehicleMake with ID ${makeId} not found`);
    }
    return vMake3;
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
      limit: limit == 0 ? undefined : limit,
      offset: limit == 0 ? undefined : page * 1000,
    });
    return vecMakes;
  }
}
