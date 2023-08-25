export class StateMaster {
    id:string;
    stnm: string;
    stcd: number;
    stateName: string;
    countryName: string;
    countryId: Number
    stateAbbrv: string;
    activeflag: any;
    UpdateBy: string;
    EntryBy: string;
    stateCode: string;
    stateType: string;
    srNo: any;
    isActive: boolean;
    stateAlias: any;
    gstWiseStateCode: any;
    constructor(StateMaster) {
        {
            this.id=StateMaster._id||''
            this.stcd = StateMaster.stcd || 'System Genrated';
            this.stateName = StateMaster.stateName || '';
            this.countryName = StateMaster.countryName || '';
            this.stateType = StateMaster.stateType || '';
            this.stateAbbrv = StateMaster.stateAbbrv || '';
            this.activeflag = StateMaster.activeflag || false;
        }
    }
}