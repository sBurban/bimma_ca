# bimma_ca

> nest new bimm_ac

- pnpm

error: pnpm install --strict-peer-dependencies=false

> pnpm approve-builds

- Spacebar to select "@nestjs/core"
- Enter
- y

> pnpm install

> pnpm install @nestjs/config @nestjs/sequelize sequelize sequelize-typescript pg

---

- co: controller
- mo: module
- s: service
  nest g mo modules/VehicleMakes
  nest g co modules/VehicleMakes/VehicleMakes --flat
  nest g s modules/VehicleMakes/VehicleMakes --flat
  nest g mo modules/VehicleMakeTypes
  nest g co modules/VehicleMakeTypes/VehicleMakeTypes --flat
  nest g s modules/VehicleMakeTypes/VehicleMakeTypes --flat

---

> pnpm install --save @nestjs/axios axios
> pnpm install fast-xml-parser

---

Index on Vehicle_Make_Types.vehicle_make_id, to improve query speeds.
Normally would be a "junction table" between other 2 tables, but for this task, we don't really need to have a table dedicated to unique "Vehicle Types".
