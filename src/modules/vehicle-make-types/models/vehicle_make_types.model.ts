import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  PrimaryKey,
  Table,
  Model,
  Index,
} from "sequelize-typescript";

import { VehicleMakes } from "src/modules/vehicle-makes/models/vehicle_makes.model";

@Table({
  tableName: 'VehicleMakeTypes',
  timestamps: false,
})
export class VehicleMakeTypes extends Model {
  @PrimaryKey
  @Column({
    autoIncrement: true,
  })
  declare id: number;

  @Column({ type: DataType.INTEGER })
  vehicle_type_id: number;

  @Column({ type: DataType.STRING })
  vehicle_type_name: string;

  @Index('idx_vehicle_make_id')
  @ForeignKey(() => VehicleMakes)
  @Column({ type: DataType.INTEGER })
  vehicle_make_id: number;

  @BelongsTo(() => VehicleMakes)
  vehicleMake: VehicleMakes;
}
