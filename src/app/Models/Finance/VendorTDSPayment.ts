
export class TDSRequestModel {
  companyCode: number
  docType: string
  branch: string
  finYear: string
  data: TDSHdrDataRequestModel
  Headerdata: TDSHdrDataRequestModel
  Detailsdata: TDSDetDataRequestModel
}


export class TDSHdrDataRequestModel {
  _id: string;
  cID: number;
  tPSNO: string;
  docNo: string;
  tPSDATE: Date;
  mANUALNO: String;
  fINYEAR: String;
  aMT: number;
  lOC: string;
  tDSChallanNo: string;
  vND: {
    cD: string;
    nM: string;
    pAN: string;
    aDD: string;
    mOB: number;
    eML: string;
    sT: string;
  };
  pAY:{
    mOD:string;
    bANK:string;
    bANKCD:string;
    aCCD:string;
    aCNM:string;
    dTM:Date;
    cREFNO:string;
  };
  sTS: number;
  sTSNM: string;
  sTSBY: string;
  sTSDT: Date;
  vNO: string;
  cNL: boolean;
  cNLDT: Date;
  cNLBY: string;
  cNLRES: string;
  eNTDT: Date;
  eNTLOC: string;
  eNTBY: string;
}

export class TDSDetDataRequestModel {
  _id: string;
  cID: number;
  tPSNO: string;
  tPSDATE: Date;
  docNo: string;
  tYP: string;
  lOC: string;
  bILLNO: string;
  bGNDT: string;
  vND: {
    cD: string;
    nM: string;
    pAN: string;
    aDD: string;
    mOB: number;
    eML: string;
    sT: string;
  };
  tDS: {
    eXMT: boolean;
    sEC: string;
    sECD: string;
    rATE: string;
    aMT: number;
  };
  aMT: number;
  eXMT: boolean;
  eXMTRES: string;
  eNTDT: Date;
  eNTLOC: string;
  eNTBY: string;
  mODDT: Date;
  mODLOC: string;
  mODBY: string;
}
