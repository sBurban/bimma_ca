import { Test, TestingModule } from '@nestjs/testing';
import { VehicleMakeTypesService } from './vehicle-make-types.service';

describe('VehicleMakeTypesService', () => {
  let service: VehicleMakeTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehicleMakeTypesService],
    }).compile();

    service = module.get<VehicleMakeTypesService>(VehicleMakeTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
