export class prqDetail {   
    prqNo: string;
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
    contractAmt:number;
    Action: string;

    constructor(data: any) {
        this.prqNo = data.prqNo ?? 'System Generated';
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
        this.pAddress = data.pAddress ?? '';
        this.pickupDate = data.pickupDate ?? new Date(data.pickupDate) ; // Convert to Date
        this.status = data.status ?? '';
        this.statusCode = data.statusCode ?? '';
        this.payType = data.payType ?? '';
        this.payTypeCode = data.payTypeCode ?? '';
        this.Action = data.Action ?? '';
        this.contractAmt=data.contractAmt??0;
    }
}
