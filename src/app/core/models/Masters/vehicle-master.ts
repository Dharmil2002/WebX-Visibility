
export class vehicleModel {
  isActive: boolean;
  companyId: number;
  vehicleNo: string;
  vendorName: string;
  vendorType: string;
  gpsDeviceEnabled: boolean;
  rcBookNo: string;
  _id: string;
  entryBy: string;
  entryDate = new Date();
  updateBy: string;
  updateDate: Date;
  vehroutecd: any;
  gpsProvider: any;
  ftlTypeDesc: any;
  vendcode: any;
  vehno: any;
  noOfDrivers: any;
  vehregno: any;
  unldWt: any;
  gvw: any;
  gpsDeviceId: any;
  capacity: any;
  rate_km: number;
  innerLength: number;
  innerHeight: number;
  innerWidth: number;
  cft: number;
  route: any;
  noOfPackages: any;
  date = new Date()
  division: any;
  DivisionDrop: any;
  vehicleType: any;
  modelNo: any;
  lengthinFeet: any;
  widthinFeet: any;
  heightinFeet: any;
  id: any;
  controllBranch: any;
  vendorTypeCode: number
  gpsProviderCode:any;

  constructor(vehicleModel) {
    this.id = vehicleModel._id || this.getRandomID();
    this.vehicleType = vehicleModel.vehicleType || '';
    this.division = vehicleModel.division || '';
    this.vendorType = vehicleModel.vendorType || '';
    this.vendorName = vehicleModel.vendorName || '';
    this.cft = vehicleModel.cft || 0;
  }
  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }
}
