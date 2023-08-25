export class LocationMaster {
  locLevel: string;
  reportTo: string;
  reportLoc: string;
  locCode: string;
  locName: string;
  locPincode: string;
  locState: string;
  locRegion: string;
  locAddr: string;
  locTelno: string;
  locCity: string;
  locTel: string;
  locMobile: string;
  endMile: string;
  locZone: string;
  ownership: string;
  dataLoc: string;
  nextLoc: string;
  prevLoc: string;
  acctLoc: string;
  locStartDt: string;
  locEndDt: string;
  ctbs: string;
  computerised: any;
  cutoff: any;
  time: any;
  activeFlag: any;
  defaultLoc: string;
  nearLoc: string;
  conLoc: string;
  paid: string;
  pay: string;
  profit: string;
  locEmail: string;
  contLoc: string;
  _id: string;
  reportLevel: any;

  constructor(LocationMaster) {
    {
      this.locLevel = LocationMaster.locLevel || '';
      this.reportTo = LocationMaster.reportTo || '';
      this.reportLoc = LocationMaster.reportLoc || '';
      this.locCode = LocationMaster.locCode || '';
      this.locName = LocationMaster.locName || '';
      this.locPincode = LocationMaster.locPincode || '';
      this.locAddr = LocationMaster.locAddr || '';
      this.locState = LocationMaster.locState || '';
      this.locCity = LocationMaster.locCity || '';
      this.locMobile = LocationMaster.locMobile || '';
      this.locTel = LocationMaster.locTel || '';
      this.ownership = LocationMaster.ownership || '';
      this.locEmail = LocationMaster.locEmail || '';
      this.locStartDt = LocationMaster.locStrtDate || '';
      this.locEndDt = LocationMaster.locEndDate || '';
      this.locZone = LocationMaster.locZone || '';
      this.activeFlag = LocationMaster.activeFlag || false;
      this.endMile = LocationMaster.endMile || '';
      this.contLoc = LocationMaster.contLoc || '';
      this.acctLoc = LocationMaster.acctLoc || '';
      this.dataLoc = LocationMaster.dataLoc || '';
      this.defaultLoc = LocationMaster.defaultLoc || '';
      this.nearLoc = LocationMaster.nearLoc || '';
    }

  }
}