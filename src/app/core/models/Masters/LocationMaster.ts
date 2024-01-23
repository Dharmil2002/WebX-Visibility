export class LocationMaster {
  locLevel: string;
  reportTo: string;
  reportLoc: string;
  locCode: string;
  locName: string;
  locPincode: string;
  locState: string;
  locStateId: number;
  locRegion: string;
  locAddr: string;
  locCity: string;
  locZone: string;
  ownership: string;
  activeFlag: any;
  _id: string;
  reportLevel: any;
  locCountry: string
  Latitude: string
  Longitude: string
  mappedCity: any;
  mappedState: any;
  mappedPinCode: any;
  pincodeHandler: any[]
  gstNumber: string;
  companyCode: number;
  eNTBY: string;
  eNTLOC: string;
  eNTDT: Date;
  constructor(LocationMaster) {
    {
      this.locLevel = LocationMaster.locLevel || '';
      //this.reportTo = LocationMaster.reportTo || '';
      this.reportLoc = LocationMaster.reportLoc || '';
      this.locCode = LocationMaster.locCode || '';
      this.locName = LocationMaster.locName || '';
      this.locPincode = LocationMaster.locPincode || '';
      this.locAddr = LocationMaster.locAddr || '';
      this.locState = LocationMaster.locState || '';
      this.locStateId = LocationMaster.locStateId || 0;
      this.locCity = LocationMaster.locCity || '';
      this.ownership = LocationMaster.ownership || '';
      //this.locZone = LocationMaster.locZone || '';
      this.activeFlag = LocationMaster.activeFlag || false;
      this.Latitude = LocationMaster.latitude || '';
      this.Longitude = LocationMaster.longitude || '';
      this.mappedCity = LocationMaster.mappedCity || '';
      this.mappedState = LocationMaster.mappedState || '';
      this.mappedPinCode = LocationMaster.mappedPinCode || '';
      this.gstNumber = LocationMaster.gstNumber || '';
    }

  }
}