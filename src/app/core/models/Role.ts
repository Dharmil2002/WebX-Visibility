export class RoleMaster {
    roleId: any
    companyId: number;
    roleName: string
    id: string | number;
    isActive: boolean;
    entryBy: string;
    isSystemRole: string;
    updateBy: string;
    IsSuccess: string;
    Action: string;
    IsUpdate: string;

    constructor(RoleMaster) {
        this.id = RoleMaster.id || this.getRandomID();
        this.roleId = RoleMaster.roleId || '';
        this.roleName = RoleMaster.roleName || '';
        this.isActive = RoleMaster.isActive || '';
        this.isSystemRole = RoleMaster.isSystemRole || '';
        this.Action = RoleMaster.Action || '';
        this.entryBy = RoleMaster.entryBy || '';
        this.updateBy = RoleMaster.updateBy || '';
    }

    public getRandomID(): string {
        const S4 = () => {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return S4() + S4();
    }
}
export class MasteQuery {
    queryOn: any;
}
