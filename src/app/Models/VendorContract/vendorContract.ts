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
export class LastMileDelivery {
    _id: string;
    cID: number;
    cNID: string;
    lOCID: string;
    lOCNM: string;
    cPCTID: string;
    cPCTNM: string;
    rTTID: string;
    rTTNM: string;
    tMFRMID: string;
    tMFRMNM: string;
    mIN: number;
    cMTKM: number;
    aDDKM: number;
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

export class BusinessAssociate {
    _id: string;
    cID: number;
    cNID: string;
    mDID: string;
    mDNM: string;
    oPID: string;
    oPNM: string;
    rTID: string;
    rTNM: string;
    pBSID: string;
    pBSNM: string;
    lOCID: string;
    lOCNM: string;
    mIN: number;
    rT: number;
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