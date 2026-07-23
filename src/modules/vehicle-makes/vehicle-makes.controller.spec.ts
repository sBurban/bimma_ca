import { Test, TestingModule } from '@nestjs/testing';
import { VehicleMakesController } from './vehicle-makes.controller';

describe('VehicleMakesController', () => {
  let controller: VehicleMakesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleMakesController],
    }).compile();

    controller = module.get<VehicleMakesController>(VehicleMakesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
