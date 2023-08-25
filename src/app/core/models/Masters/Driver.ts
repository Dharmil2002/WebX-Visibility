export class DriverMaster {
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
  vehicleNo: string;
  //DriverLocation:string;
  vendorDriverCode: string;
  licenseNo: string;
  valdityDt: string;
  //IssueByRTO:string;
  activeFlag: boolean;
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
  joiningDate: string;
  driverId: string;
  blackListedReason: string;
  _id: string;

  bName: string;
  bAcct: string;
  branch: string;
  acctName: string;
  ifsc: string;
  constructor(DriverMaster) {
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
    this.valdityDt = DriverMaster.valdityDt || '';
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
}
