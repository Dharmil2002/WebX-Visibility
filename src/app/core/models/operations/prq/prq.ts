export class prqDetail {
    prqNo: string;
    vehicleSize: string;
    billingParty: string;
    fromToCity: string;
    fromCity: string;
    toCity: string;
    transMode: string;
    prqBranch:string;
    vehicleNo: string;
    contactNo: number;
    pickupDate: Date;  // Changed the type to Date
    status: string;
    containerSize:string;
    typeContainer:string;
    payType:string;
    pAddress:string;
    Action: string;
    

    constructor(data: any) {
        this.prqNo = data.prqNo ?? 'System Generated';
        this.vehicleSize = data.vehicleSize ?? '';
        this.billingParty = data.billingParty ?? '';
        this.fromToCity = data.fromToCity ?? '';
        this.fromCity = data.fromCity ?? '';
        this.toCity = data.toCity ?? '';
        this.transMode = data.transMode ?? '';
        this.prqBranch=data.prqBranch??'';
        this.vehicleNo = data.vehicleNo ?? '';
        this.containerSize = data.containerSize ?? '';
        this.typeContainer = data.typeContainer ?? '';
        this.pAddress = data.pAddress ?? '';
        this.pickupDate = data.pickupDate ? new Date(data.pickupDate) : new Date(); // Convert to Date
        this.status = data.status ?? '';
        this.payType = data.payType ?? '';
        this.Action = data.Action ?? '';
    }
}
