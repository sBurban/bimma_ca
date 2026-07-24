import { Module } from '@nestjs/common';
import { VehicleMakeTypesController } from './vehicle-make-types.controller';
import { VehicleMakeTypesService } from './vehicle-make-types.service';

import { SequelizeModule } from '@nestjs/sequelize';
import { XmlUtilsModule } from 'src/common/services/XmlUtils/XmlUtilsl.module';

import { VehicleMakeTypes } from './models/vehicle_make_types.model';

@Module({
  imports: [SequelizeModule.forFeature([VehicleMakeTypes]), XmlUtilsModule],
  controllers: [VehicleMakeTypesController],
  providers: [VehicleMakeTypesService],
  exports: [VehicleMakeTypesService],
})
export class VehicleMakeTypesModule {}
