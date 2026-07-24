import {
  Column,
  DataType,
  HasMany,
  PrimaryKey,
  Table,
  Model,
} from "sequelize-typescript";

import { VehicleMakeTypes } from "src/modules/vehicle-make-types/models/vehicle_make_types.model";

@Table({
  tableName: 'VehicleMakes',
  timestamps: false,
})
export class VehicleMakes extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
  })
  make_id: number;

  @Column({
    type: DataType.STRING,
  })
  make_name: string;

  @HasMany(() => VehicleMakeTypes)
  vehicleTypes: VehicleMakeTypes[];
}
