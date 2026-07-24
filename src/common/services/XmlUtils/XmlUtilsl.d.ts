export type XmlVehicleMakeEntity = { Make_ID: number; Make_Name: string };
export type XmlAllVehicleMakes = { AllVehicleMakes: XmlVehicleMakeEntity[] };
export interface XmlToJsonFormatResponse<Type> {
  Response: {
    Count: number;
    Message: string;
    Results: Type;
  };
}
export type XmlVehicleMakeTypeEntity = { VehicleTypeId: number; VehicleTypeName: string };
export type XmlVehicleMakeTypesList = {
  VehicleTypesForMakeIds: XmlVehicleMakeTypeEntity[] | XmlVehicleMakeTypeEntity;
};
