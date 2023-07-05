export class DriverMaster {
    driverCat: string;
    driver_Location: string
    entryBy: string
    updatedBy: string
    isUpdate: boolean
    date=new Date()
    ManualDriverCode: any;
    DriverFatherName:any;
    DriverName:string;
    VehicleNumber:string;
    DriverLocation:string;
    VendorDriverCode:string;
    LicenseNo:string;
    ValidityDate:string;
    IssueByRTO:string;
    ActiveFlag:boolean;
    DriverStatus:string;
    IsBlackListed:boolean;
    ContactNo:string;
    DateOfBirth:string;
    GuarantorName:string;
    GuarantorMobileNo:string;
    DriverCategory:string;
    Ethnicity:string;
    DriverTestCode:string;
    PermanentAddress:string;
    PermanentPincode:string;
    PermanentCity:string;
    JoiningDate:string;
    DriverId:string;
    blackListedReason:string;

    constructor(DriverMaster) {
      this.DriverId = DriverMaster.DriverId ;
      this.DriverName = DriverMaster.DriverName || '';
      this.DriverFatherName = DriverMaster.DriverFatherName || '';
      this.ManualDriverCode = DriverMaster.ManualDriverCode || '';
      this.VehicleNumber = DriverMaster.VehicleNumber || '';
      this.VendorDriverCode = DriverMaster.VendorDriverCode || '';
      this.DateOfBirth = DriverMaster.DateOfBirth || new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate());
      this.GuarantorName = DriverMaster.GuarantorName || '';
      this.GuarantorMobileNo = DriverMaster.GuarantorMobileNo ;
      this.driverCat = DriverMaster.driverCat || '';
      this.JoiningDate = DriverMaster.JoiningDate || this.date;
      this.LicenseNo = DriverMaster.LicenseNo || '';
      this.IssueByRTO = DriverMaster.IssueByRTO || '';
      this.ValidityDate = DriverMaster.ValidityDate ||'';
      this.blackListedReason = DriverMaster.blackListedReason || '';
      this.PermanentAddress = DriverMaster.PermanentAddress || '';
      this.PermanentCity = DriverMaster.PermanentCity || '';
      this.PermanentPincode = DriverMaster.PermanentPincode;
      this.IsBlackListed = DriverMaster.IsBlackListed || false;
      this.ActiveFlag = DriverMaster.ActiveFlag || false;
    }
  }
