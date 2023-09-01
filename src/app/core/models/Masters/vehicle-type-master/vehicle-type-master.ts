export class VehicleTypeMaster {
  vehicleTypeCode: string
  pincodeCategory: number
  area: string
  serviceable: string
  cityname: string
  stateName: string;
  activeFlag: string;
  vehicleFillRate: number;
  vehicleTypeName: string
  vehicleManufacturerName: string
  vehicleTypeCategory: string
  tankCapacity: number
  isActive: boolean
  capacity: number
  length: number
  width: number
  vehicleSize: number
  height: number
  capacityDiscount: number
  tyreRotationAlertKMs: number
  noOfPackages: number
  averageSpeed: number
  fixedCost: number
  variableCost: number
  availableFrom: number
  availableTill: number
  loadingTime: string
  unloadingTime: string
  weight: number
  maxVisitingLocations: number
  vehicleCategory: string
  division: string
  modelNo: any
  tyreRotationatKm: any
  typeDescription: any
  grossVehicleWeight: any
  unladenWeight: any
  ratePerKM: any
  fuelType: any
  _id: string
  constructor(vehicleTypeMaster) {
    {
      this.vehicleTypeCode = vehicleTypeMaster.vehicleTypeCode || '';
      this.pincodeCategory = vehicleTypeMaster.pincodeCategory || '';
      this.area = vehicleTypeMaster.area || '';
      this.serviceable = vehicleTypeMaster.serviceable || '';
      this.stateName = vehicleTypeMaster.stateName || '';
      this.cityname = vehicleTypeMaster.cityname || '';
      this.activeFlag = vehicleTypeMaster.activeFlag || false;
      this.vehicleFillRate = vehicleTypeMaster.vehicleFillRate || 0.0
      this.averageSpeed = vehicleTypeMaster.averageSpeed || 0.0
      this.fixedCost = vehicleTypeMaster.fixedCost || 0.0
      this.variableCost = vehicleTypeMaster.variableCost || 0.0
      this.availableFrom = vehicleTypeMaster.availableFrom || 0.0
      this.availableTill = vehicleTypeMaster.availableTill || 0.0
      this.loadingTime = vehicleTypeMaster.loadingTime || 0.0
      this.unloadingTime = vehicleTypeMaster.unloadingTime || 0.0
      this.weight = vehicleTypeMaster.weight || 0.0
      this.maxVisitingLocations = vehicleTypeMaster.maxVisitingLocations || 0.0
      this.vehicleSize = vehicleTypeMaster.vehicleSize || 0.0
    }
  }
}