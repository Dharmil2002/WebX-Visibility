export interface PackageInfo {
    shipment?: string;
    eDNoOfPackage?: number;
    eDWeight?: number;
    eDRate?: number;
    eDFreight?: number;
    eDInvoiceAmt?: number;
    datetime?:Date;
    editBy?:string;
    location?:string;
  }
export interface BillingInfo {
    stateName?: string;
    cnoteCount?: number;
    countSelected?: number;
    subTotalAmount?: number;
    gstCharged?: number;
    totalBillingAmount?: number;
    extraData:any;
  }