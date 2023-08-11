export class GeneralMaster {
    codeId: string;
    codeDesc: number;
    activeFlag: string;
    updateBy: string;
    entryBy: string;
    id:string;

    generalcode: string
    //HeaderCode: string;
    headerCode:string;
    headerDesc:string;
    codeType:string;
    isActive: any;
   // CodeId: string;
    //CodeDesc: string;
    //IsEwayBillExempted: any;
    item:any;
    constructor(GeneralMaster) {
        {
            this.codeId = GeneralMaster.codeDesc || '';
            this.codeDesc = GeneralMaster.codeDesc || '';
            this.activeFlag = GeneralMaster.activeFlag || false;
        }
    }
}