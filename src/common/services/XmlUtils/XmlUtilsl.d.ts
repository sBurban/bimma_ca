export type XmlVehicleMakeEntity = { Make_ID: number; Make_Name: string };
export type XmlAllVehicleMakes = { AllVehicleMakes: XmlVehicleMakeEntity[] };
export interface XmlToJsonFormatResponse<Type> {
  Response: {
    Count: number;
    Message: string;
    Results: Type;
  };
}
