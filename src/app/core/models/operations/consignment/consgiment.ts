export class DocketDetail {
    _id: string
    docketNumber: string
    docketDate: string
    billingParty: string
    payType: string
    origin: string
    fromCity: string
    toCity: string
    destination: string
    prqNo: string
    transMode: string
    containerSize: string
    containerNumber: string
    vendorType: string
    vendorName: string
    cnbp: boolean
    cnebp: boolean
    consignorName: string
    pAddress: string
    ccontactNumber: string
    calternateContactNo: string
    consigneeName: string
    deliveryAddress: string
    cncontactNumber: string
    cnalternateContactNo: string
    companyCode: string
    vehicleNo: string
    //rake_no: string
    delivery_type: string
    risk: string
    gp_ch_del: string
    //cargo_type: string
    weight_in: string
    packaging_type: string
    edd: Date
    pr_lr_no: string
    issuing_from: string
    status: number
    freight_amount: string
    freight_rate: string
    freightRatetype: string
    otherAmount: string
    grossAmount: string
    rcm: string
    gstAmount: string
    gstChargedAmount: string
    totalAmount: string
    isComplete: number
    unloading: number
    lsNo: string
    mfNo: string
    entryBy: any
    entryDate: string
    unloadloc: string
    tran_day: string
    tran_hour: string
    actualWeight: number
    vehicleDetail:any
    invoiceDetails: InvoiceDetail[]
    containerDetail: ContainerDetail[]

    constructor(data: any) {
        this._id = data._id ?? '';
        this.docketNumber = data.docketNumber ?? 'System Generated';
        this.docketDate = data.docketDate ?? '';
        this.billingParty = data.billingParty ?? '';
        this.payType = data.payType ?? '';
        this.origin = data.origin ?? '';
        this.fromCity = data.fromCity ?? '';
        this.toCity = data.toCity ?? '';
        this.destination = data.destination ?? '';
        this.prqNo = data.prqNo ?? '';
        this.transMode = data.transMode ?? '';
        this.containerSize = data.containerSize ?? '';
        this.containerNumber = data.containerNumber ?? '';
        this.vendorType = data.vendorType ?? '';
        this.vendorName = data.vendorName ?? '';
        this.cnbp = data.cnbp ?? false;
        this.cnebp = data.cnebp ?? false;
        this.consignorName = data.consignorName ?? '';
        this.pAddress = data.pAddress ?? '';
        this.ccontactNumber = data.ccontactNumber ?? '';
        this.calternateContactNo = data.calternateContactNo ?? '';
        this.consigneeName = data.consigneeName ?? '';
        this.deliveryAddress = data.deliveryAddress ?? '';
        this.cncontactNumber = data.cncontactNumber ?? '';
        this.cnalternateContactNo = data.cnalternateContactNo ?? '';
        this.companyCode = data.companyCode ?? '';
        this.vehicleNo = data.vehicleNo ?? '';
        this.status = data.status ?? 0;
        this.freight_amount = data.freightAmount ?? '';
        this.freight_rate = data.freight_rate ?? '';
        this.freightRatetype = data.freightRatetype ?? '';
        this.otherAmount = data.otherAmount ?? '';
        this.grossAmount = data.grossAmount ?? '';
        this.rcm = data.rcm ?? '';
        this.gstAmount = data.gstAmount ?? '';
        this.gstChargedAmount = data.gstChargedAmount ?? '';
        this.totalAmount = data.totalAmount ?? '';
        this.isComplete = data.isComplete ?? 0;
        this.unloading = data.unloading ?? 0;
        this.lsNo = data.lsNo ?? '';
        this.mfNo = data.mfNo ?? '';
        this.unloadloc = data.unloadloc ?? '';
        this.actualWeight = data.actualWeight ?? 0;
        this.invoiceDetails = data.invoiceDetails ?? []
        this.containerDetail = data.containerDetail ?? []
        this.pr_lr_no=data.pr_lr_no??""
        this.edd=data.edd??new Date();
        this.packaging_type=data.packaging_type??""
        this.weight_in=data.weight_in??""
      //  this.cargo_type=data.cargo_type??""
        this.gp_ch_del=data.gp_ch_del??""
        this.risk=data.risk??""
        this.delivery_type=data.delivery_type??""
       // this.rake_no=data.rake_no??""
        this.issuing_from=data.issuing_from??"" 
        this.tran_day= data.tran_day??"" 
        this.tran_hour= data.tran_hour??"" 
    }

}

export class InvoiceDetail {
    id:number
    ewayBillNo: string
    expiryDate: string
    invoiceNo: string
    invoiceAmount: string
    noofPkts: string
    materialName: string
    actualWeight: string
    chargedWeight: string
    expiryDateO: string
    invoice: boolean=true
    actions: ['Edit', 'Remove']
    iNVNO: string
    eWBNO: string
    eXPDT: any
    iNVAMT: string
    pKGS: string
    mTNM: string
    aCTWT: string
    cHRWT: string
}

export class ContainerDetail {
    id:number
    containerNumber: string
    containerType: string
    containerCapacity: string
    invoice: boolean
    actions: ['Edit', 'Remove']
  cNNO: string
  cNCPT: string
  cNTYPN: string
  cNID: string
  isEmpty: any
  isEMPT: any
}

