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

---

GRAPHQL METHODS

NestJs has 2 methodologies for configuring GraphQL.

- Code-First
- Schema-First

Code-First "might be faster" to implement on NestJs, but I prefer "Schema-First" for several reasons:

- Files location structure is more intuitive, similar to how REST files would normally be organized.
- As it's easier to locate all GraphQL logic, it's easier for other teams to read the implementation if they need to use it.
- Easier to migrate the GraphQL implementation in case of:
  - Backend migration to another Tech stack.
  - Hosting the Schema files on a central registry for Microservices purposes

# For Express and Apollo (default)

> pnpm i ts-morph @nestjs/graphql @nestjs/apollo @apollo/server @as-integrations/express5 graphql

[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: @apollo/protobufjs@1.2.8

> pnpm approve-builds

-approve to run post-install scripts
\-`pnpm-workspace.yaml` stores the approved builds for future quick installations (automation/deployment)

> pn install

-If needed, install missing peer-dependencies (PNPM ignores them by default)

---

Error Handling and Logging

> $ pnpm install --save class-validator class-transformer

- Added Global Interceptor for formatting REST responses
- Added dedicated Logging to the App.
- NestJS has a default Global Exception-Filter for catching and formatting errors. Further customization is possible depending on requirements and priorities.
