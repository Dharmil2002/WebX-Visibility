export class ShipmentDetail {
    _id: string = '';
    docketNumber: string = '';
    docketDate: string = '';
    billingParty: string = '';
    payType: string = '';
    origin: string = '';
    fromCity: string = '';
    toCity: string = '';
    destination: string = '';
    prqNo: string = '';
    transMode: string = '';
    vendorType: string = '';
    vendorName: string = '';
    pAddress: string = '';
    deliveryAddress: string = '';
    pr_lr_no: string = '';
    edd: string = '';
    packaging_type: string = '';
    weight_in: string = '';
    cargo_type: string = '';
    gp_ch_del: string = '';
    risk: string = '';
    delivery_type: string = '';
    rake_no: string = '';
    vehicleNo: string = '';
    ccbp: boolean = false;
    cd: boolean = false;
    consignorName: string = '';
    ccontactNumber: string = '';
    calternateContactNo: string = '';
    consigneeName: string = '';
    cncontactNumber: string = '';
    cnalternateContactNo: string = '';
    companyCode: string = '';
    status: number = 0;
    freight_rate: string = '';
    freightRatetype: string = '';
    freight_amount: number = 0;
    otherAmount: string = '';
    grossAmount: string = '';
    rcm: string = '';
    gstAmount: string = '';
    gstChargedAmount: string = '';
    totalAmount: string = '';
    invoiceDetails: InvoiceDetail[] = [];
    containerDetail: any[] = [];
    isComplete: number = 0;
    unloading: number = 0;
    lsNo: string = '';
    mfNo: string = '';
    entryBy: any = null;
    entryDate: string = '';
    unloadloc: string = '';
    docNo: string = '';
    issuing_from: string = '';
    chargedWeight: string = '';
    actualWeight: string = '';
    totalPkg: string = '';
  
    
  }
  
  
  export class InvoiceDetail {
    ewayBillNo: string = '';
    expiryDate: string = '';
    invoiceNo: string = '';
    invoiceAmount: string = '';
    noofPkts: string = '';
    materialName: string = '';
    actualWeight: string = '';
    chargedWeight: string = '';
    expiryDateO: string = '';
  }
  