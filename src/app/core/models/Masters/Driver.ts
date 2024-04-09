export class DriverMaster {
  driverPhoto: string;
  addressProofScan: string;
  vehicleNo: string
  countryCD: number;
  country: string;
  licenseScan: string;
  DOBProofScan: string;
  _id: number;
  dCategory: string;
  driverLocation: string
  entryBy: string
  updatedBy: string
  isUpdate: boolean
  manualDriverCode: any;
  driverName: string;
  licenseNo: string;
  valdityDt: Date;
  activeFlag: boolean;
  telno: number;
  dDob: Date;
  Ethnicity: string;
  DriverTestCode: string;
  address: string;
  pincode: string;
  city: string;
  addressProofDocNo: string;
  DOBProofDocNo: string;
  eNTBY: string;
  cID: number;
  eNTDT: Date;
  eNTLOC: string;
  constructor(DriverMaster) {
    this.eNTDT = DriverMaster.eNTDT || new Date();
    this.eNTLOC = DriverMaster.eNTLOC || localStorage.getItem("Branch");
    this.driverName = DriverMaster.driverName || '';
    this.manualDriverCode = DriverMaster.manualDriverCode || '';
    this.vehicleNo = DriverMaster.vehicleNo || '';
    this.dDob = DriverMaster.dDob || '';
    this.licenseNo = DriverMaster.licenseNo || '';
    this.address = DriverMaster.PermanentAddress || '';
    this.city = DriverMaster.city || '';
    this.pincode = DriverMaster.pincode;
    this.activeFlag = DriverMaster.activeFlag || false;
    this.telno = DriverMaster.telno || '';
    this.DOBProofDocNo = DriverMaster.DOBProofDocNo || '';
    this.driverPhoto = DriverMaster.driverPhoto || '';
    this.licenseScan = DriverMaster.licenseScan || '';
    this.addressProofScan = DriverMaster.addressProofScan || '';
    this.DOBProofScan = DriverMaster.DOBProofScan || '';
    this.addressProofDocNo = DriverMaster.addressProofDocNo || ''
    this.eNTBY = DriverMaster.eNTBY || '';
    this.cID = DriverMaster.companyCode || parseInt(localStorage.getItem("companyCode"));
  }
 
}
