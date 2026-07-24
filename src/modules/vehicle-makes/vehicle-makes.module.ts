import { Module } from '@nestjs/common';
import { VehicleMakesController } from './vehicle-makes.controller';
import { VehicleMakesService } from './vehicle-makes.service';

import { SequelizeModule } from '@nestjs/sequelize';
import { VehicleMakes } from './models/vehicle_makes.model';
import { HttpModule } from '@nestjs/axios';

import { VehicleMakeTypesModule } from '../vehicle-make-types/vehicle-make-types.module';

@Module({
  imports: [SequelizeModule.forFeature([VehicleMakes]), HttpModule, VehicleMakeTypesModule],
  controllers: [VehicleMakesController],
  providers: [VehicleMakesService],
  exports: [VehicleMakesService],
})
export class VehicleMakesModule {}
