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
  companyCode: number
  branch: string
  closingBranch?: string
  tHCDT: Date
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
  status: number
  statusName: string
  financialStatus: number
  financialStatusName: string
  contAmt: number
  advAmt: number
  aDVPENAMT: number
  balAmt: number
  advPdAt: string
  balAmtAt: string
  vouchersList?: string[]
  iSBILLED: boolean
  bILLNO: string
  Driver_name: string
  Driver_mobile: string
  Driver_lc: string
  Driver_exd?: Date
  Capacity_ActualWeight: number
  Capacity_volume: number
  Capacity_volumetricWeight: number
  Utilization_ActualWeight: number
  Utilization_volume: number
  Utilization_volumetricWeight: number
  departed_sCHDT: Date
  departed_eXPDT: Date
  departed_aCTDT: Date
  departed_gPSDT?: Date
  departed_oDOMT?: number
  arrived_sCHDT?: Date
  arrived_eXPDT?: Date
  arrived_aCTDT?: Date
  arrived_gPSDT?: Date
  arrived_oDOMT?: number
  sCHDIST?: number
  aCTDIST?: number
  gPSDIST?: number
  tMODE: string
  tMODENM: string
  pRQNO: string
  cNL: boolean
  cNDT?: Date
  cNBY?: string
  cNRES?: string
  eNTDT: Date
  eNTLOC: string
  eNTBY: string
  mODDT?: Date
  mODLOC?: string
  mODBY?: string  
}

export class ThcmovementDetails {
  cID: number
  fLOC: string
  tLOC: string
  lOAD: LOad
  cAP: CAp
  uTI: UTi
  dPT: DPt
  aRR?: ARr
  uNLOAD?: UNload
  sCHDIST?: number
  aCTDIST?: number
  gPSDIST?: number
  eNTDT: Date
  eNTLOC: string
  eNTBY: string
  mODDT?: Date
  mODLOC?: string
  mODBY?: string
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
  sCHDT: Date
  eXPDT: Date
  aCTDT: Date
  gPSDT?: Date
  oDOMT?: number
}

export class ARr {
  sCHDT?: Date
  eXPDT?: Date
  aCTDT?: Date
  gPSDT?: Date
  oDOMT?: number
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
  mDT: Date
  oRGN: string
  dEST: string
  dKTS: number
  pKGS: number
  wT: number
  vOL: number
  tHC: string
  iSARR: boolean
  aRRDT?: Date
  eNTDT: Date
  eNTLOC: string
  eNTBY: string
  mODDT?: Date
  mODLOC?: string
  mODBY?: string
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
  iSARR?: boolean
  aRRDT?: Date
  eNTDT: Date
  eNTLOC: string
  eNTBY: string
  mODDT?: Date
  mODLOC?: string
  mODBY?: string
}
