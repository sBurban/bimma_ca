import { Module } from '@nestjs/common';
import { VehicleMakesController } from './vehicle-makes.controller';
import { VehicleMakesService } from './vehicle-makes.service';

import { SequelizeModule } from '@nestjs/sequelize';
import { VehicleMakes } from './models/vehicle_makes.model';
import { HttpModule } from '@nestjs/axios';

import { XmlUtilsModule } from 'src/common/services/XmlUtils/XmlUtilsl.module';

import { VehicleMakeTypesModule } from '../vehicle-make-types/vehicle-make-types.module';
import { VehicleMakeResolver } from './vehicle_makes.resolver';

@Module({
  imports: [SequelizeModule.forFeature([VehicleMakes]), HttpModule, XmlUtilsModule, VehicleMakeTypesModule],
  controllers: [VehicleMakesController],
  providers: [VehicleMakesService, VehicleMakeResolver],
  exports: [VehicleMakesService],
})
export class VehicleMakesModule {}
