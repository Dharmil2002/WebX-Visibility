export class poserviceDetail {
    pOID: string;
    cPONO:string;
    pOAMT:number;
    pODT: Date;
    pOENTRYDT: Date;
    rMKS:string;
   

    constructor(data: any) {
        this.pOID = data.pOID ?? 'System Generated';
        this.cPONO = data.cPONO ?? '';
        this.pOAMT=data.pOAMT??0;
        this.pODT = data.pODT ?? new Date(data.pODT) ; 
        this.pOENTRYDT = data.pOENTRYDT ?? new Date(data.pOENTRYDT) ; 
        this.rMKS = data.rMKS ?? '';
    
        
    }
}
