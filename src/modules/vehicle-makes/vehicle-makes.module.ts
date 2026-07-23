import { Module } from '@nestjs/common';
import { VehicleMakesController } from './vehicle-makes.controller';
import { VehicleMakesService } from './vehicle-makes.service';

import { SequelizeModule } from '@nestjs/sequelize';
import { VehicleMakes } from './models/vehicle_makes.model';

@Module({
  imports: [SequelizeModule.forFeature([VehicleMakes])],
  controllers: [VehicleMakesController],
  providers: [VehicleMakesService],
  exports: [VehicleMakesService],
})
export class VehicleMakesModule {}
