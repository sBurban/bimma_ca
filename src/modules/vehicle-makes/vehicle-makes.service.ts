import {
  Injectable,
  Logger,
  NotFoundException,
  HttpException,
} from '@nestjs/common';

import { XmlUtilsService } from 'src/common/services/XmlUtils/XmlUtilsl.service';
import type {
  XmlVehicleMakeEntity,
  XmlAllVehicleMakes,
  XmlToJsonFormatResponse,
} from 'src/common/services/XmlUtils/XmlUtilsl';
import {
  XML_FIND_ALL,
  // XML_FIND_MAKEID,
} from 'src/common/constants/xml_uris.constants';

import { InjectModel } from '@nestjs/sequelize';
import { Sequelize as TSsequelize } from 'sequelize-typescript';
import type { FindAttributeOptions } from 'sequelize';

import { VehicleMakes } from './models/vehicle_makes.model';
import { VehicleMakeTypes } from '../vehicle-make-types/models/vehicle_make_types.model';
import { VehicleMakeTypesService } from '../vehicle-make-types/vehicle-make-types.service';

const typeAttributes = [
  ['vehicle_type_id', 'typeId'],
  ['vehicle_type_name', 'typeName'],
] as FindAttributeOptions;

const makeAttributes = [
  ['make_id', 'makeId'],
  ['make_name', 'makeName'],
] as FindAttributeOptions;

@Injectable()
export class VehicleMakesService {
  private readonly logger = new Logger(VehicleMakesService.name);

  constructor(
    public sequelize: TSsequelize,
    @InjectModel(VehicleMakes) private vehicleMakeModel: typeof VehicleMakes,
    private vecMakeTypeService: VehicleMakeTypesService,
    private xmlUtilsService: XmlUtilsService,
  ) {}

  async initTableRows(allVehicleMakes: XmlVehicleMakeEntity[]) {
    this.logger.verbose('function [InitTableRows]');
    if (
      !allVehicleMakes ||
      !Array.isArray(allVehicleMakes) ||
      allVehicleMakes.length === 0
    ) {
      const errStr = 'No valid VehicleMakes records for insertion!';
      this.logger.warn(errStr);
      throw new Error(errStr);
    }

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
      this.logger.log(
        `Bulk insertion success, all records inserted correctly.`,
      );
    } catch (error) {
      // Rolls back everything
      await transaction.rollback();
      this.logger.error('Bulk insertion failed, transaction rolled back:', {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        message: error.message,
      });

      throw new Error('Fn [initTableRows] stopped: Bulk insertion failed'); // 👈 REQUIRED
    }
  }

  // Fetch extended object with Renamed Attributes
  async findOne(makeId: number): Promise<VehicleMakes> {
    this.logger.verbose('function [FindOne]');
    const vecIncludeItem = {
      model: VehicleMakeTypes,
      required: true,
      attributes: typeAttributes,
    };
    const vecMakeOptions = {
      where: { make_id: makeId },
      attributes: makeAttributes,
      include: [vecIncludeItem],
    };

    const vecMake = await this.vehicleMakeModel.findOne(vecMakeOptions);
    this.logger.debug(`Found VehicleTypes for MakeId[${makeId}]: `, {
      data: vecMake,
    });
    if (vecMake) return vecMake;

    // Create the "MakeType" records, then fetch the extended "VehicleMake" object.
    const added = await this.vecMakeTypeService.create({ makeId, skip: true });
    if (added) {
      const vMake2 = await this.vehicleMakeModel.findOne(vecMakeOptions);
      this.logger.debug(`Found VehicleTypes for MakeId[${makeId}]: `, {
        data: vMake2,
      });
      if (vMake2) return vMake2;
    }
    // Last Fail-Handler
    // If for some reason "vMake2" fails, load record with incomplete data.
    const newVecOptions = {
      ...vecMakeOptions,
      include: [{ ...vecIncludeItem, require: false }],
    };
    const vMake3 = await this.vehicleMakeModel.findOne(newVecOptions);
    if (!vMake3) {
      this.logger.debug(`No VehicleTypes Found for MakeId[${makeId}]`);
      throw new NotFoundException(`VehicleMake with ID ${makeId} not found`);
    }
    return vMake3;
  }

  // Fetch all records in "VehicleMake" table without extended attributes.
  async findAll(
    args?: { limit: number; page: number } | undefined,
  ): Promise<VehicleMakes[]> {
    const { limit = 0, page = 0 } = args ?? {};
    this.logger.verbose(`function [FindAll]: (limit: ${limit}, page: ${page})`);
    const records_count = await this.vehicleMakeModel.count();
    try {
      if (records_count == 0) {
        const parsedResponse: XmlToJsonFormatResponse<XmlAllVehicleMakes> =
          await this.xmlUtilsService.getXML(XML_FIND_ALL);

        const results = parsedResponse?.Response?.Results?.AllVehicleMakes; // Array or single Object
        if (!results) {
          this.logger.error('FN [FindAll] stopped insertion: Invalid XML');
          throw new HttpException(
            {
              status: 503,
              error: 'Service Unavailable: Invalid XML, empty or malformed',
            },
            503,
          );
        }
        await this.initTableRows(results);
      }
    } catch (error) {
      this.logger.error('FN [initTableRows] failed', error);
      throw error;
    }

    try {
      const vecMakes = await this.vehicleMakeModel.findAll({
        attributes: makeAttributes,
        limit: limit == 0 ? undefined : limit,
        offset: limit == 0 ? undefined : page * 1000,
      });

      this.logger.log(`Fetched all (${vecMakes.length}) records successfully `);
      return vecMakes;
    } catch (error) {
      this.logger.error('DB fetch failed', error);
      throw error;
    }
  }
}
