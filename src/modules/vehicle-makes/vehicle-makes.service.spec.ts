import { Test, TestingModule } from '@nestjs/testing';
import { VehicleMakesService } from './vehicle-makes.service';

describe('VehicleMakesService', () => {
  let service: VehicleMakesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehicleMakesService],
    }).compile();

    service = module.get<VehicleMakesService>(VehicleMakesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
