import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  PrimaryKey,
  Table,
  Model,
} from "sequelize-typescript";

import { VehicleMakes } from "src/modules/vehicle-makes/models/vehicle_makes.model";

@Table({
  tableName: 'VehicleMakeTypes',
  timestamps: false,
})
export class VehicleMakeTypes extends Model {
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  vehicle_type_id: number;

  @Column({ type: DataType.STRING })
  vehicle_type_name: string;

  @ForeignKey(() => VehicleMakes)
  @Column({ type: DataType.INTEGER })
  vehicle_make_id: number;

  @BelongsTo(() => VehicleMakes)
  vehicleMake: VehicleMakes;
}
