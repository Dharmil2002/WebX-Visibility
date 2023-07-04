export class customerModel {
  groupCode: string;
  customerCode: string;
  customerName: string;
  customerPassword: string;
  industry: string;
  customerAbbreviation: string;
  activeFlag: string;
  mobileService: string;
  mobile: string;
  ownership: string;
  customerControllingLocation: string;
  customerLocation: string;
  nonOda: string;
  telephone: string;
  email: string;
  website: string;
  entryby?: any;
  entrydate?: any;
  partyType: any;
  updtby?: any;
  gstNumber: string;
  custBillName: string;
  billAddress: string;
  billCity: string;
  billPincode: string;
  sameAddres: string;
  bankName: string;
  branch: string;
  bankAcct: string;
  payBasis: string;
  serviceOpted: string;
  consignorSite: string;
  consigneeSite: string;
  pan: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  serviceOptedFor: any;

  constructor(CustomerMaster) {
    {
      this.customerCode = CustomerMaster.customerCode || 'System Generated';
      this.groupCode = CustomerMaster.groupCode || ''
      this.customerName = CustomerMaster.customerName || ''
      this.customerPassword = CustomerMaster.customerPassword || ''
      this.activeFlag = CustomerMaster.activeFlag || ''

    }
  }
}
export class Customer {
  CompanyCode: number;
  CUSTCD: string;
  UPDTBY: string;
  CUST_ACTIVE: any;
}
export class GetCustomerDetails {
  IsSuccess: string;
  Message: string;
  CustomerMaster: customerModel[];
}
export class customerResponse {
  isSuccess: boolean;
  message: string;
  Customerlist: customerModel[];
}
