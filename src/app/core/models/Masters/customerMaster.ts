export class customerModel {
  customerGroup: string;
  customerName: string;
  CustomerCategory: string;
  customerLocations: any;
  Customer_Emails: string;
  ERPcode: string;
  PANnumber: string;
  uplodPANcard: string;
  CINnumber: string;
  RegisteredAddress: string;
  PinCode: number;
  city: string;
  state: string;
  Country: string;
  MSMENumber: string;
  MSMEscan: string;
  BlackListed: boolean;
  activeFlag: boolean;
  customerCode: string;
  companyCode: number;
  updatedDate: Date;
  updatedBy: string;
  GSTdetails: {
    gstAddres: string;
    gstCity: string;
    gstNo: string;
    gstPinCode: number;
    gstState: string;
  }[];
  customer_mobile: number;
  TANNumber: string;

  constructor(customerMaster: any) {
    this.customerGroup = customerMaster.customerGroup || '';
    this.customerName = customerMaster.customerName || '';
    this.CustomerCategory = customerMaster.CustomerCategory || '';
    this.customerLocations = customerMaster.customerLocations || null;
    this.Customer_Emails = customerMaster.Customer_Emails || '';
    this.ERPcode = customerMaster.ERPcode || '';
    this.PANnumber = customerMaster.PANnumber || '';
    this.uplodPANcard = customerMaster.uplodPANcard || '';
    this.CINnumber = customerMaster.CINnumber || '';
    this.RegisteredAddress = customerMaster.RegisteredAddress || '';
    this.PinCode = customerMaster.PinCode || 0;
    this.city = customerMaster.city || '';
    this.state = customerMaster.state || '';
    this.Country = customerMaster.Country || '';
    this.MSMENumber = customerMaster.MSMENumber || '';
    this.MSMEscan = customerMaster.MSMEscan || '';
    this.BlackListed = customerMaster.BlackListed || false;
    this.activeFlag = customerMaster.activeFlag || false;
    this.customerCode = customerMaster.customerCode || '';
    this.companyCode = customerMaster.companyCode || 0;
    this.updatedDate = customerMaster.updatedDate || new Date();
    this.updatedBy = customerMaster.updatedBy || '';
    this.GSTdetails = customerMaster.GSTdetails || [];
    this.customer_mobile = customerMaster.customer_mobile || 0;
    this.TANNumber = customerMaster.TANNumber || '';
  }
}
