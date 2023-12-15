export class vendorContractUpload {
    _id: string;
    cID: number;
    cNID: string;
    rTID: string;
    rTNM: string;
    cPCTID: string;
    cPCTNM: string;
    rTTID: string;
    rTTNM: string;
    rT: number;
    mIN: number;
    mAX: number;
    eNTBY: string;
    eNTLOC: string;
    eNTDT: Date;
    constructor() {
        this.eNTBY = localStorage.getItem("UserName");
        this.eNTLOC = localStorage.getItem("Branch");
        this.eNTDT = new Date();
    }

}