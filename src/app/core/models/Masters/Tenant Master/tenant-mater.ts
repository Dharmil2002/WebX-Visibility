export class TenantModel {
  bRANDLABEL:any;
  cOUNTRY: any;
  tIMEZONE:any;
  cURRENCY: any;
  cOMNM: string;
  sHORTCODE: string;
  cOMCODE:string;
  bRANCHCODE:string;
  pUNCHLINE:string;
  lOGO: string;
  _id: string;
  activeFlag: boolean;
  constructor(TenantMaster) {
    // this.cOMNM = TenantMaster.cOMNM || '';
    // this.sHORTCODE = TenantMaster.sHORTCODE || '';
  }
}
