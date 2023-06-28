export class DriverMaster {
    driver_Id: number;
    companyCode: number
    driver_Name: string
    dFather_Name: string
    manual_Driver_Code: string
    activeFlag: boolean
    driverCat: string;
    driver_Location: string
    vehno: string
    vendorDriverCode: string
    telno: number
    d_DOB: string
    guarantor_Name: string
    guarantorMobileNo: number
    g_category: string
    joiningDate: string
    license_No: string
    issue_By_RTO: string
    valdity_dt: string
    isBlackListed: any
    blackListedReason: string
    p_Address: string
    p_City: string
    p_Pincode: number
    c_Address: string
    c_City: string
    c_Pincode: number
    entryBy: string
    updatedBy: string
    isUpdate: boolean
    date=new Date()
    constructor(DriverMaster) {
      this.driver_Id = DriverMaster.driver_Id ;
      this.driver_Name = DriverMaster.driver_Name || '';
      this.dFather_Name = DriverMaster.dFather_Name || '';
      this.manual_Driver_Code = DriverMaster.manual_Driver_Code || '';
      this.vehno = DriverMaster.vehno || '';
      this.vendorDriverCode = DriverMaster.vendorDriverCode || '';
      this.telno = DriverMaster.telno;
      this.d_DOB = DriverMaster.d_DOB || new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate());
      this.guarantor_Name = DriverMaster.guarantor_Name || '';
      this.guarantorMobileNo = DriverMaster.guarantorMobileNo ;
      this.driverCat = DriverMaster.driverCat || '';
      this.joiningDate = DriverMaster.joiningDate || this.date;
      this.license_No = DriverMaster.license_No || '';
      this.issue_By_RTO = DriverMaster.issue_By_RTO || '';
      this.valdity_dt = DriverMaster.valdity_dt || this.date;
      this.blackListedReason = DriverMaster.blackListedReason || '';
      this.p_Address = DriverMaster.p_Address || '';
      this.p_City = DriverMaster.p_City || '';
      this.p_Pincode = DriverMaster.p_Pincode;
      this.c_Address = DriverMaster.c_Address || '';
      this.c_City = DriverMaster.c_City || '';
      this.c_Pincode = DriverMaster.c_Pincode;
      this.isBlackListed = DriverMaster.isBlackListed || false;
      this.activeFlag = DriverMaster.isActive || false;
    }
  }
  
  export class DriverStatus {
    CompanyCode: number;
    Driver_Id: string;
    UpdatedBy: string
    ActiveFlag: string;
  }
  export class FileUpload {
    data: File;
  }
  export class DriverUpload {
    isSuccess: boolean;
    filepath: string;
    constructor(DriverUpload) {
      {
        this.filepath = DriverUpload.filepath || '';
        this.isSuccess = DriverUpload.isSuccess || false;
      }
    }
  }
  