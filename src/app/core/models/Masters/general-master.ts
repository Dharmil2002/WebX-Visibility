export class GeneralMaster {
    codeId: string;
    codeDesc: number;
    activeFlag: string;
    updateBy: string;
    entryBy: string;
    _id: string;
    generalcode: string
    headerCode: string;
    headerDesc: string;
    codeType: string;
    isActive: any;
    item: any;
    constructor(GeneralMaster) {
        {
            this.codeId = GeneralMaster.codeDesc || '';
            this.codeDesc = GeneralMaster.codeDesc || '';
            this.activeFlag = GeneralMaster.activeFlag || false;
        }
    }
}