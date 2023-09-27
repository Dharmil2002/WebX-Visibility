export class VehicleTypeMaster {
  vehicleTypeCode: string
  vehicleTypeName: any;
  vehicleTypeCategory: string
  isActive: boolean
  fuelType: any
  _id: string
  oemmodel: any
  constructor(vehicleTypeMaster) {
    {
      this.vehicleTypeCode = vehicleTypeMaster.vehicleTypeCode || '';
      this.isActive = vehicleTypeMaster.isActive || false;
    }
  }
}