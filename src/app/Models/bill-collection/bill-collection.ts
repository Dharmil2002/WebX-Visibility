export interface billCollection {
    _id: string;
    cID: number;
    bUSVRT: string;
    bILLNO: string;
    bGNDT: string;
    bDUEDT: string;
    bLOC: string;
    pAYBAS: string;
    bSTS: number;
    bSTSNM: string;
    bSTSDT: string;
    eXMT: boolean;
    eXMTRES: boolean;
    gEN: {
      lOC: string;
      cT: string;
      sT: string;
      gSTIN: string;
    };
    sUB: {
      loc: string;
      sDT: string;
      sBY: string;
      sDoc: string;
    };
    cOL: {
      aMT: number;
      bALAMT: number;
    };
    cUST: {
      cD: string;
      nM: string;
      tEL: string;
      aDD: string;
      eML: string;
      cT: string;
      sT: string;
      gSTIN: string;
    };
    gST: {
      tYP: string;
      rATE: string;
      iGST: number;
      cGST: number;
      sGST: number;
      aMT: number;
    };
    sUPDOC: string;
    pRODID: number;
    dKTCNT: number;
    CURR: string;
    dKTTOT: number;
    gROSSAMT: number;
    aDDCHRG: number;
    rOUNOFFAMT: number;
    aMT: number;
    cNL: boolean;
    cNLDT: string;
    cNBY: string;
    cNRES: string;
    eNTDT: string;
    eNTLOC: string;
    eNTBY: string;
    mODDT: string;
    mODLOC: string;
    mODBY: string;
    docNo: string;
    billGenerationDate: string;
    collected: number;
    deductions: number;
    collectionAmount: number;
    pendingAmount: number;
  }