import { formatDate } from '@angular/common';
export class EmissionMaster {
    id: any
    emissionFactorCode: number;
    companyId: number;
    fuelTypeId: number;
    fuelTypes: string;
    fuelName: string;
    fuelUOM: string;
    ghguom: string;
    ghgFactoryYear: string;
    ghgConversionFactor: string;
    entryBy: string;
    updateBy: string;
    IsSuccess: string;
    action: string;
    IsUpdate: string;

    constructor(EmissionMaster) {
        this.id = EmissionMaster.id || this.getRandomID();
        this.emissionFactorCode = EmissionMaster.emissionFactorCode || '';
        this.companyId = EmissionMaster.companyId || '';
        this.fuelTypeId = EmissionMaster.fuelTypeId || '';
        this.fuelName = EmissionMaster.fuelName || '';
        this.fuelTypes = EmissionMaster.fuelTypes || '';
        this.fuelUOM = EmissionMaster.fuelUOM || '';
        this.ghguom = EmissionMaster.ghguom || '';
        this.ghgFactoryYear = EmissionMaster.ghgFactoryYear || '';
        this.ghgConversionFactor = EmissionMaster.ghgConversionFactor || '';
        this.action = EmissionMaster.action || '';
        this.entryBy = EmissionMaster.entryBy || '';
        this.updateBy = EmissionMaster.updateBy || '';
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

export class FuelTypeAutoDropdown {
    constructor(public fuelTypeId: number, public fuelTypes: string) { }
}