export const XML_FIND_ALL =
  'https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML';
export const XML_FIND_MAKEID = (makeId: string | number) =>
  `https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/${makeId}?format=xml`;
