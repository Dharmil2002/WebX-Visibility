export class VendorMaster {
  vendorCode: string
  vendorName: any
    vendorbrcd:string
    vendorCity:string
    vendorType: any
    vendorSubType: any
    vendorAddress: any
    vendorLocation: any
    vendorPinCode: any
    vendorPhoneNo: any
    emailId: any
    isGSTCharged: any
    isActive: any
    tdsSection: any
    tdsType: any
    lspName: any
    select:any 
    tdsApplicable: any
    panNo: any
    tdsDocument: any
    cancelCheque: any
    remark: any
    paymentEmail: any
    deliveryPartner: any
    logicloudLSP: any
    lSPName: any
    accountNumber: any
    ifscNumber: any
    bankName: any
    pDFFileUpload: any
    audited: any
    msme: any
    dueDays: any
    ownerName: any
    gstNo: any
    cPCode: any
    franchise: any
    integrateWithFinSystem: any
    reliableDocument: any
    constructor(VendorMaster) {
      {
        this.vendorCode = VendorMaster.vendorCode || 'System Genrated';
        this.vendorName = VendorMaster.vendorName || '';
      }
    }
  }

  