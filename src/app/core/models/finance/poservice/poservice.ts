export class poserviceDetail {
    pOID: string;
    cPONO:string;
    pOAMT:number;
    pODT: Date;
    pOENTRYDT: Date;
    rMKS:string;
    vehicleSize: string;
    vehicleSizeCode: string;
    size: number;
    billingParty: string;
    billingPartyCode: string;
    fromToCity: string;
    fromCity: string;
    toCity: string;
    carrierType: string;
    carrierTypeCode: string;
    prqBranch:string;
    vehicleNo: string;
    contactNo: number;
    pickupDate: Date;
    status: string;
    statusCode: string;
    containerSize:string;
    typeContainer:string;
    typeContainerCode: string;
    payType:string;
    payTypeCode:string;
    pAddress:string;
    pAddressName:string
    contractAmt:number;
    Action: string;
    oDRNO:string;
    oDRBY:string;
    oDRDT: Date;

    constructor(data: any) {
        this.pOID = data.pOID ?? 'System Generated';
        this.cPONO = data.cPONO ?? '';
        this.pOAMT=data.pOAMT??0;
        this.pODT = data.pODT ?? new Date(data.pODT) ; 
        this.pOENTRYDT = data.pOENTRYDT ?? new Date(data.pOENTRYDT) ; 
        this.rMKS = data.rMKS ?? '';
        this.vehicleSize = data.vehicleSize ?? '';
        this.vehicleSizeCode = data.vehicleSizeCode ?? '';
        this.size = data.size ?? 0;
        this.billingParty = data.billingParty ?? '';
        this.billingPartyCode = data.billingPartyCode ?? '';
        this.fromToCity = data.fromToCity ?? '';
        this.fromCity = data.fromCity ?? '';
        this.toCity = data.toCity ?? '';
        this.carrierType = data.carrierType ?? '';
        this.carrierTypeCode = data.carrierTypeCode ?? '';
        this.prqBranch=data.prqBranch??'';
        this.vehicleNo = data.vehicleNo ?? '';
        this.containerSize = data.containerSize ?? '';
        this.typeContainer = data.typeContainer ?? '';
        this.typeContainerCode = data.typeContainerCode ?? '';
        this.pAddress = data.pADD ?? '';
        this.pAddressName = data.pADDNM ?? '';
        this.pickupDate = data.pickupDate ?? new Date(data.pickupDate) ; // Convert to Date
        this.status = data.status ?? '';
        this.statusCode = data.statusCode ?? '';
        this.payType = data.payType ?? '';
        this.payTypeCode = data.payTypeCode ?? '';
        this.Action = data.Action ?? '';
        this.contractAmt=data.contractAmt??0;
        this.oDRNO = data.oDRNO ?? '';
        this.oDRDT = data.oDRDT ?? "" ;
        this.oDRBY = data.oDRBY ?? '';
        
    }
}
