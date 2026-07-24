import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

// import { ApiOperation } from '@nestjs/swagger';

import { VehicleMakesService } from './vehicle-makes.service';
import { VehicleMakes } from './models/vehicle_makes.model';

@Controller('vehicle-makes')
export class VehicleMakesController {
  constructor(private readonly makeService: VehicleMakesService) {}

  // @ApiOperation(patientsDocs.findOne)
  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<VehicleMakes> {
    return this.makeService.findOne(id);
  }

  // @ApiOperation(patientsDocs.findAll)
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(0), ParseIntPipe) limit: number,
  ): Promise<VehicleMakes[]> {
    // Pagination Offset first record starts starts at 0
    const nLimit = limit < 0 ? 0 : limit;
    const nPage = page < 0 ? 0 : page;
    return this.makeService.findAll(nLimit, nPage);
  }
}
