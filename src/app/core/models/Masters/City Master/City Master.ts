export class CityMaster {
  cityName: string;
  cityId: number;
  stateId: number;
  stateName: string;
  zoneId: number;
  zoneName: string;
  isActive: boolean;
  companyId: any;
  _id: any;
  srNo: any;
  state: any;
  zone: any;
  entryBy: any;
  odaFlag: any;
  userpassword: any;

  constructor(CityMaster) {
    {
      this.cityId = CityMaster.cityId || 'System Genrated';
      this.cityName = CityMaster.cityName || '';
      this.stateId = CityMaster.stateId || '';
      this.zoneId = CityMaster.zoneId || '';
    }
  }
}
