import { Test, TestingModule } from '@nestjs/testing';
import { VehicleMakeTypesController } from './vehicle-make-types.controller';

describe('VehicleMakeTypesController', () => {
  let controller: VehicleMakeTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleMakeTypesController],
    }).compile();

    controller = module.get<VehicleMakeTypesController>(VehicleMakeTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
