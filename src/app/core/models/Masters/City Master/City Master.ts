export class CityMaster {
    cityName: string;
    cityId: number;
    StateId: Number;
    stateId: number;
    StateName: string;
    stateName: string;
    ZoneId: number;
    zoneId: number;
    ZoneName: string;
    zoneName: string;
    IsActive: boolean;
    isActive: boolean;
    UpdateBy: string;
    EntryBy: string;
    companyId: any;
    CityId: any;
    id: string;
  srNo: any;
  
    constructor(CityMaster) {
        {
            this.cityId = CityMaster.cityId || 'System Genrated';
            this.cityName = CityMaster.cityName || '';
            this.stateId = CityMaster.stateId || '';
            this.zoneId = CityMaster.zoneId || '';
        }
    }
  }
  export class StateAutoDropdown {
    constructor(public cityId: number, public citynm: string, public FromCity: string) { }
  }
  