export class CustomerGroupMaster {
    groupCode: string;
    groupName: number;
    groupPassword: string;
    activeFlag: any;
    updateBy: string;
    entryBy: string;
    _id:string;
    constructor(CustomerGroupMaster) {
        {
            this.groupCode = CustomerGroupMaster.groupCode || '';
            this.groupName = CustomerGroupMaster.groupName || '';
            this.groupPassword = CustomerGroupMaster.groupPassword || '';
            this.activeFlag = CustomerGroupMaster.activeFlag || false;
        }
    }
}