export class LocationMaster {
  locLevel: string;
  reportTo: string;
  reportLoc: string;
  locCode: string;
  locName: string;
  locPincode: string;
  locState: string;
  locAddr: string;
  locCity: string;
  locTel: string;
  locMobile: string;
  locEndmile: string;
  locZone: string;
  ownership: string;
  dataLoc: string;
  acctLoc: string;
  locStrtDate:string;
  locEndDate:string;
  ctbs:string;
  computerised:any;
  cutOff:any;
  time:any;
  activeFlag:any;
  defaultLoc:string;
  nearLoc:string;
  conLoc:string;
  paid:string;
  pay:string;
  profit:string;
  locEmail:string;
  contLoc:string;

  constructor(LocationMaster) {
    {
      this.locLevel = LocationMaster.locLevel || '';
      this.reportTo = LocationMaster.reportTo || '';
      this.locCode = LocationMaster.locCode || '';
      this.locName = LocationMaster.locName || '';
      this.locPincode = LocationMaster.locPincode || '';
      this.locAddr = LocationMaster.locAddr || '';
      this.locState = LocationMaster.locState || '';
      this.locCity = LocationMaster.locCity || '';
      this.locMobile = LocationMaster.locMobile || '';
      this.locTel = LocationMaster.locTel || '';
      this.locEmail = LocationMaster.locEmail || '';
      this.locStrtDate = LocationMaster.locStrtDate || '';
      this.locEndDate = LocationMaster.locEndDate || '';
      this.locZone = LocationMaster.locZone || '';
      this.activeFlag = LocationMaster.activeFlag || false;
      this.locEndmile = LocationMaster.locEndmile || '';
      this.contLoc = LocationMaster.contLoc || '';


    }

  }
}