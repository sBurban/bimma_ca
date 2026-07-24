import { ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { VehicleMakesService } from './vehicle-makes.service';

import { VehicleMakes } from './models/vehicle_makes.model';

@Resolver('VehicleMake')
export class VehicleMakeResolver {
  constructor(private vehicleMakeService: VehicleMakesService) {}

  @Query('vehicleMakes')
  async getAllVehicleMakes(
    @Args('limit', new DefaultValuePipe(0), ParseIntPipe) limit?: number,
    @Args('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
  ) {
    const nLimit = !limit || limit < 0 ? 0 : limit;
    const nPage = !page || page < 0 ? 0 : page;
    const results = await this.vehicleMakeService.findAll({ limit: nLimit, page: nPage });
    const mapping = results.map((m) => m.toJSON());
    return mapping;
  }

  @Query('vehicleMake')
  async findOneByMakeId(
    @Args('id', ParseIntPipe)
    id: number,
  ): Promise<VehicleMakes> {
    return this.vehicleMakeService.findOne(id);
  }
}
