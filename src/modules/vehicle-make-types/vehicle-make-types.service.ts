import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize as TSsequelize } from 'sequelize-typescript';

import { XmlUtilsService } from 'src/common/services/XmlUtils/XmlUtilsl.service';
import { XML_FIND_MAKEID } from 'src/common/constants/xml_uris.constants';
import type { XmlToJsonFormatResponse, XmlVehicleMakeTypesList } from 'src/common/services/XmlUtils/XmlUtilsl';

import { VehicleMakeTypes } from './models/vehicle_make_types.model';

@Injectable()
export class VehicleMakeTypesService {
  constructor(
    public sequelize: TSsequelize,
    @InjectModel(VehicleMakeTypes)
    private vehicleMakeTypeModel: typeof VehicleMakeTypes,
    private xmlUtilsService: XmlUtilsService,
  ) {}

  async create({ makeId, skip = false }: { makeId: number; skip?: boolean; }) {
    // Checks if at least 1 "Type" exists for "MakeId"
    const existing = skip ? undefined : await this.vehicleMakeTypeModel.findOne({
      where: { vehicle_make_id: makeId }
    });
    console.log("🚀 ~ VehicleMakeTypesService ~ create ~ existing:", !!existing)
    if (existing) return existing;

    // If no "Type" exists, fetch source XML and create missing records.
    const jObj: XmlToJsonFormatResponse<XmlVehicleMakeTypesList> =
      await this.xmlUtilsService.getXML(XML_FIND_MAKEID(makeId));
    console.log('🚀 ~ vehicle_make_types.service.ts:28 ~ VehicleMakeTypesService ~ create ~ jObj:', jObj);
    // return jObj;
    // jObj.Response.Results.VehicleTypesForMakeIds.VehicleTypeId
    const results = jObj.Response.Results.VehicleTypesForMakeIds; // Array or single Object
    const vecTypes = Array.isArray(results) ? results : [results];

    // Wait until all records have been created.
    const typeArr = await Promise.all(
      vecTypes.map((vmType) => {
        return this.vehicleMakeTypeModel.create({
          vehicle_type_id: vmType.VehicleTypeId,
          vehicle_type_name: vmType.VehicleTypeName,
          vehicle_make_id: makeId,
        });
      }),
    );

    return typeArr;
  }
}
