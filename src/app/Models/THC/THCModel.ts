export class THCGenerationModel {
  companyCode: number
  data: thcsummaryData
  thcmovementDetails: ThcmovementDetails
  mfheaderDetails: MfheaderDetails
  mfdetailsList: MfdetailsList[]
  docType: string
  branch: string
  finYear: string
}

export class thcsummaryData {
  companyCode: string
  branch: string
  closingBranch: string
  fromCity: string
  toCity: string
  routecode: string
  route: string
  vehicle: string
  Vendor_type: string
  Vendor_typetName: string
  Vendor_Code: string
  Vendor_Name: string
  Vendor_pAN: string
  status: string
  statusName: string
  financialStatus: string
  financialStatusName: string
  contAmt: string
  advAmt: string
  balAmt: number
  advPdAt: string
  balAmtAt: string
  vouchersList: any[]
  iSBILLED: boolean
  bILLNO: string
  Driver_name: string
  Driver_mobile: string
  Driver_lc: string
  Driver_exd: string
  Capacity_ActualWeight: number
  Capacity_volume: string
  Capacity_volumetricWeight: string
  Utilization_ActualWeight: string
  Utilization_volume: string
  Utilization_volumetricWeight: string
  departed_sCHDT: string
  departed_eXPDT: string
  departed_aCTDT: Date
  departed_gPSDT: string
  departed_oDOMT: string
  arrived_sCHDT: string
  arrived_eXPDT: string
  arrived_aCTDT: string
  arrived_gPSDT: string
  arrived_oDOMT: string
  sCHDIST: string
  aCTDIST: string
  gPSDIST: string
  cNL: string
  cNLDT: string
  cNLBY: string
  cNBY: string
  cNRES: string
  eNTDT: Date
  eNTLOC: string
  eNTBY: string
  mODDT: string
  mODLOC: string
  mODBY: string
  tMODE: string
}

export class ThcmovementDetails {
  cID: number
  fLOC: string
  tLOC: string
  lOAD: LOad
  cAP: CAp
  uTI: UTi
  dPT: DPt
  aRR: ARr
  uNLOAD: UNload
  sCHDIST: number
  aCTDIST: number
  gPSDIST: number
  eNTDT: Date
  eNTLOC: string
  eNTBY: string
  mODDT: string
  mODLOC: string
  mODBY: string
}

export class LOad {
  dKTS: number
  pKGS: number
  wT: number
  vOL: number
  vWT: number
  sEALNO: string
  rMK: string
}

export class CAp {
  wT: number
  vOL: number
  vWT: number
}

export class UTi {
  wT: number
  vOL: number
  vWT: number
}

export class DPt {
  sCHDT: string
  eXPDT: string
  aCTDT: Date
  gPSDT: string
  oDOMT: number
}

export class ARr {
  sCHDT: string
  eXPDT: string
  aCTDT: string
  gPSDT: string
  oDOMT: number
}

export class UNload {
  dKTS: number
  pKGS: number
  wT: number
  vOL: number
  vWT: number
  sEALNO: string
  rMK: string
  sEALRES: string
}

export class MfheaderDetails {
  cID: number
  companyCode: number
  mDT: string
  oRGN: string
  dEST: string
  dKTS: number
  pKGS: number
  wT: number
  vOL: string
  tHC: string
  iSARR: boolean
  ARRDT: string
  eNTDT: Date
  eNTLOC: string
  eNTBY: string
  mODDT: string
  mODLOC: string
  mODBY: string
}

export class MfdetailsList {
  cID: number
  dKTNO: string
  sFX: number
  cNID: string
  oRGN: string
  dEST: string
  pKGS: number
  vOL: number
  wT: number
  lDPKG: number
  lDVOL: number
  lDWT: number
  aRRPKG: number
  aRRPWT: number
  aRRVOL: number
  aRRLOC: string
  iSARR: boolean
  ARRDT: string
  eNTDT: Date
  eNTLOC: string
  eNTBY: string
  mODDT: string
  mODLOC: string
  mODBY: string
}
