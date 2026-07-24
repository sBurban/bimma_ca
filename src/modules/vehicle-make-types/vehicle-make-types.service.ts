import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize as TSsequelize } from 'sequelize-typescript';

import { XmlUtilsService } from 'src/common/services/XmlUtils/XmlUtilsl.service';
import { XML_FIND_MAKEID } from 'src/common/constants/xml_uris.constants';
import type {
  XmlToJsonFormatResponse,
  XmlVehicleMakeTypesList,
} from 'src/common/services/XmlUtils/XmlUtilsl';

import { VehicleMakeTypes } from './models/vehicle_make_types.model';

@Injectable()
export class VehicleMakeTypesService {
  private readonly logger = new Logger(VehicleMakeTypesService.name);

  constructor(
    public sequelize: TSsequelize,
    @InjectModel(VehicleMakeTypes)
    private vehicleMakeTypeModel: typeof VehicleMakeTypes,
    private xmlUtilsService: XmlUtilsService,
  ) {}

  async create({ makeId, skip = false }: { makeId: number; skip?: boolean }) {
    this.logger.verbose(`function [Create]: (MakeId: ${makeId}`);
    // Checks if at least 1 "Type" exists for "MakeId"
    const existing = skip
      ? undefined
      : await this.vehicleMakeTypeModel.findOne({
          where: { vehicle_make_id: makeId },
        });
    if (existing) return existing;

    // If no "Type" exists, fetch source XML and create missing records.
    const parsedResponse: XmlToJsonFormatResponse<XmlVehicleMakeTypesList> =
      await this.xmlUtilsService.getXML(XML_FIND_MAKEID(makeId));

    const results = parsedResponse?.Response?.Results?.VehicleTypesForMakeIds; // Array or single Object

    if (!results) {
      this.logger.error('FN [Create] stopped: XML Results Empty or malformed');
      return undefined;
    }

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

    this.logger.debug(`New VehicleMakeTypes created successfully`, {
      data: typeArr,
    });

    return typeArr;
  }
}
