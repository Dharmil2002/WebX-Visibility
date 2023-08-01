export class GeneralMaster {
    codeId: string;
    codeDesc: number;
    activeFlag: string;
    updateBy: string;
    entryBy: string;
    id:string;
    constructor(GeneralMaster) {
        {
            this.codeId = GeneralMaster.codeDesc || '';
            this.codeDesc = GeneralMaster.codeDesc || '';
            this.activeFlag = GeneralMaster.activeFlag || false;
        }
    }
}