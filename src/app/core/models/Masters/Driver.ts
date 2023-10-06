export class DriverMaster {
  driverPhoto: string;
  driverCode:string;
  addressProofScan: string;
  vehicleNo: string;
  countryCode: any;
  country: string;
  licenseScan: string;
  DOBProofScan: string;
  _id: number;
  driverCat: string;
  dCategory: string;
  driverLocation: string
  entryBy: string
  updatedBy: string
  isUpdate: boolean
  date = new Date()
  manualDriverCode: any;
  dFatherName: any;
  driverName: string;
  //DriverLocation:string;
  vendorDriverCode: string;
  licenseNo: string;
  valdityDt: any;
  //IssueByRTO:string;
  activeFlag: any;
  //DriverStatus:string;
  IsBlackListed: boolean;
  telno: string;
  dDob: string;
  // DriverCategory:string;
  Ethnicity: string;
  DriverTestCode: string;
  address: string;
  pincode: string;
  city: string;
  addressProofDocNo: string;
  DOBProofDocNo: string;
  joiningDate: string;
  driverId: string;
  blackListedReason: string;
  bName: string;
  bAcct: string;
  branch: string;
  acctName: string;
  ifsc: string;
  constructor(DriverMaster) {
    this.driverCode = DriverMaster.driverCode || '';
    // this.id = DriverMaster._id || this.getRandomID();
    this.driverId = DriverMaster.driverId;
    this.driverName = DriverMaster.driverName || '';
    this.dFatherName = DriverMaster.dFatherName || '';
    this.manualDriverCode = DriverMaster.manualDriverCode || '';
    this.vehicleNo = DriverMaster.vehicleNo || '';
    this.vendorDriverCode = DriverMaster.vendorDriverCode || '';
    // this.GuarantorName = DriverMaster.GuarantorName || '';
    this.dDob = DriverMaster.dDob || '';
    // this.GuarantorMobileNo = DriverMaster.GuarantorMobileNo ;
    this.driverCat = DriverMaster.driverCat || '';
    this.joiningDate = DriverMaster.joiningDate || '';
    this.licenseNo = DriverMaster.licenseNo || '';
    // this.IssueByRTO = DriverMaster.IssueByRTO || '';
    // this.valdityDt = DriverMaster.valdityDt || '';
    this.blackListedReason = DriverMaster.blackListedReason || '';
    this.address = DriverMaster.PermanentAddress || '';
    this.city = DriverMaster.city || '';
    this.pincode = DriverMaster.pincode;
    this.IsBlackListed = DriverMaster.IsBlackListed || false;
    this.activeFlag = DriverMaster.activeFlag || false;
    this.telno = DriverMaster.telno || '';
    this.bName = DriverMaster.bName || '';
    this.bAcct = DriverMaster.bAcct || '';
    this.branch = DriverMaster.branch || '';
    this.acctName = DriverMaster.acctName || '';
    this.ifsc = DriverMaster.ifsc || '';
  }
  // public getRandomID(): string {
  //   const S4 = () => {
  //     return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  //   };
  //   return S4() + S4();
  // }
}
