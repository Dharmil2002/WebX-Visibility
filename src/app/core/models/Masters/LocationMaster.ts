export class LocationMaster {
    loc_Level:number
    report_Level:number
    report_Loc:string
    locCode:string
    locName:string
    locPincode:string
    locAddr:string
    locState:string
    locCity:string
    locmobile:string
    locSTDCode:string
    locTelno:string
    locFaxno:string
    locEmail:string
    loc_startdt:string
    loc_enddt:string
    timezoneName:string
    loclevel:string
    locRegion:string
    latitude:number
    longitude:number
    radius:number
    managerName:string
    isActive:any
    regionId: any;
    zoneId: any;
    stateId: any;
    timezoneID: any;
    reportlevelId:any;
    loclevalId:any;
    constructor(LocationMaster) {
        {
          this.loc_Level = LocationMaster.loc_Level || '';
          this.report_Level = LocationMaster.report_Level || '';
          this.locCode = LocationMaster.locCode || '';
          this.locName = LocationMaster.locName || '';
          this.locPincode = LocationMaster.locPincode || '';
          this.locAddr = LocationMaster.locAddr || '';
          this.locState = LocationMaster.locState || '';
          this.locCity = LocationMaster.locCity || '';
          this.locmobile = LocationMaster.locmobile || '';
          this.locSTDCode = LocationMaster.locSTDCode || '';
          this.locTelno = LocationMaster.locTelno || '';
          this.locFaxno = LocationMaster.locFaxno || '';
          this.locEmail = LocationMaster.locEmail || '';
          this.loc_startdt = LocationMaster.loc_startdt || '';
          this.loc_enddt = LocationMaster.loc_enddt || '';
          this.timezoneName = LocationMaster.timezoneName || '';
          this.locRegion = LocationMaster.locRegion || '';
          this.latitude = LocationMaster.latitude || '';
          this.longitude = LocationMaster.longitude || '';
          this.radius = LocationMaster.radius || '';
          this.loclevel=LocationMaster.loclevel||'';
          this.managerName = LocationMaster.managerName || '';
          this.isActive = LocationMaster.isActive || false;
        }
  
}
}