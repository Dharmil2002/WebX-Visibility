import { StoreKeys } from 'src/app/config/myconstants';
import * as Storage from 'src/app/core/service/storage.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { HttpClient } from '@angular/common/http';
import { constant } from 'lodash';
export class VoucherRequestModel {
  companyCode: number
  docType: string
  branch: string
  finYear: string
  data: VoucherDataRequestModel
  details: DebitVoucherdetailsRequestModel[]
  debitAgainstDocumentList: DebitAgainstDocumentList[]
  accountPosting?: boolean = false;
  constructor() {
  }
}

export class VoucherDataRequestModel {
  voucherNo?: string
  transCode?: number
  transType?: string
  voucherCode?: number
  voucherType?: string
  transactionNumber?: string = '';
  transDate?: Date
  docType?: string
  branch?: string
  finYear?: string
  accLocation?: string
  preperedFor?: string
  partyCode?: string
  partyName?: string
  partyState?: string
  paymentState?: string
  entryBy?: string
  entryDate?: Date
  panNo?: string
  tdsSectionCode?: string
  tdsSectionName?: string
  tdsRate?: number
  tdsAmount?: number
  tdsAtlineitem?: boolean
  tcsSectionCode?: string
  tcsSectionName?: string
  tcsRate?: number
  tcsAmount?: number
  IGST?: number
  UGST?: number
  SGST?: number
  CGST?: number
  GSTTotal?: number
  GrossAmount?: number
  netPayable?: number
  roundOff?: number
  voucherCanceled?: boolean
  paymentMode?: string
  refNo?: string
  accountName?: string
  accountCode?: string
  date?: string
  scanSupportingDocument?: string
  mANNUM?: string
  mREFNUM?: string
  nAR?: string;
  onAccount?: boolean = false;
  reverseVoucher?: boolean = false;
}

export class DebitVoucherdetailsRequestModel {
  companyCode: number
  voucherNo: string
  transCode: number
  transType: string
  voucherCode: number
  voucherType: string
  transDate: Date
  finYear: string
  branch: string
  accCode: string
  accName: string
  sacCode: string
  sacName: string
  debit: number
  credit: number
  GSTRate: number
  GSTAmount: number
  Total: number
  TDSApplicable: boolean
  narration: string;
  PaymentMode?: string
}
export class DebitAgainstDocumentList {
  companyCode: number
  voucherNo: string
  transCode: number
  transType: string
  voucherCode: number
  voucherType: string
  transDate: string
  finYear: string
  branch: string
  Document: string
  DebitAmountAgaintsDocument: string
  DocumentType: string
}

export class CreditNoteRequestModel {
  companyCode: number
  docType: string
  branch: string
  finYear: string
  data: CNTHdrDataRequestModel
  Headerdata: CNTHdrDataRequestModel
  Detailsdata: CNTDetDataRequestModel
}


export class CNTHdrDataRequestModel {
  _id: string;
  cID: number;
  docNo: string;
  bILLNO: string;
  tYP: string;
  nTNO: string;
  nTDT: Date;
  lOC: string;
  pARTY: {
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
    aMT: number;
  };
  tXBLAMT: number;
  aMT: number;
  nTRESCD: string;
  nTRESNM: string;
  aCCD: string;
  aCNM: string;
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
  mODDT: Date;
  mODLOC: string;
  mODBY: string;
}

export class CNTDetDataRequestModel {
  _id: string;
  cID: number;
  docNo: string;
  tYP: string;
  nTNO: string;
  nTDT: Date;
  lOC: string;
  bILLNO: string;
  bGNDT: string;
  pARTY: {
    cD: string;
    nM: string;
    tEL: string;
    aDD: string;
    eML: string;
    cT: string;
    sT: string;
    gSTIN: string;
  };
  bAMT: number;
  bALAMT: number;
  tXBLAMT: number;
  aMT: number;
  eXMT: boolean;
  eXMTRES: string;
  gST: {
    hSCD: string;
    hSNM: string;
    tYP: string;
    rATE: number;
    iGRT: number;
    cGRT: number;
    sGRT: number;
    iGST: number;
    cGST: number;
    sGST: number;
    aMT: number;
  };
  eNTDT: Date;
  eNTLOC: string;
  eNTBY: string;
  mODDT: Date;
  mODLOC: string;
  mODBY: string;
}

export class DebitNoteRequestModel {
  companyCode: number
  docType: string
  branch: string
  finYear: string
  data: DNTHdrDataRequestModel
  Headerdata: DNTHdrDataRequestModel
  Detailsdata: DNTDetDataRequestModel
}


export class DNTHdrDataRequestModel {
  _id: string;
  cID: number;
  docNo: string;
  tYP: string;
  nTNO: string;
  bILLNO: string;
  nTDT: Date;
  lOC: string;
  pARTY: {
    cD: string;
    nM: string;
    tEL: string;
  };
  gST: {
    aMT: number;
  };
  tXBLAMT: number;
  aMT: number;
  tdsAMT: number;
  nTRESCD: string;
  nTRESNM: string;
  aCCD: string;
  aCNM: string;
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
  mODDT: Date;
  mODLOC: string;
  mODBY: string;
}

export class DNTDetDataRequestModel {
  _id: string;
  cID: number;
  docNo: string;
  tYP: string;
  nTNO: string;
  nTDT: Date;
  lOC: string;
  bILLNO: string;
  bGNDT: string;
  pARTY: {
    cD: string;
    nM: string;
    tEL: string;
  };
  bAMT: number;
  bALAMT: number;
  tXBLAMT: number;
  aMT: number;
  eXMT: boolean;
  eXMTRES: string;
  gST: {
    hSCD: string;
    hSNM: string;
    tYP: string;
    rATE: number;
    iGRT: number;
    cGRT: number;
    sGRT: number;
    iGST: number;
    cGST: number;
    sGST: number;
    aMT: number;
  };
  tDS: {
    aMT: number;
    eXMT: boolean;
    rATE: number;
    sECD: string;
    sEC: string;
  };
  eNTDT: Date;
  eNTLOC: string;
  eNTBY: string;
  mODDT: Date;
  mODLOC: string;
  mODBY: string;
  remark: string;
}

export enum VoucherType {
  DebitVoucher = 0,
  CreditVoucher = 1,
  JournalVoucher = 2,
  ContraVoucher = 3,

}

export enum VoucherInstanceType {
  DebitVoucherCreation = 0,
  CNoteBooking = 1,
  BillApproval = 2,
  ContraVoucherCreation = 3,
  AdviceVoucherCreation = 4,
  JournalVoucherCreation = 5,
  CreditVoucherCreation = 6,
  BillCollection = 7,
  AdvancePayment = 8,
  BalancePayment = 9,
  DeliveryMR = 10,
  VendorBillPayment = 11,
  THCArrival = 12,
  CreditNoteApproval = 13,
  DebitNoteApproval = 14,
  VendorOpeningBalance = 15,
  TdsPaymentSlipApproval = 17,
  THCGeneration = 16,
}

export const ledgerInfo = {
  "LIA002004": GetLeadgerInfoFromLocalStorage("LIA002004"),
  "LIA002002": GetLeadgerInfoFromLocalStorage("LIA002002"),
  "LIA002001": GetLeadgerInfoFromLocalStorage("LIA002001"),
  "LIA002003": GetLeadgerInfoFromLocalStorage("LIA002003"),
  "EXP001042": GetLeadgerInfoFromLocalStorage("EXP001042"),
  "AST001001": GetLeadgerInfoFromLocalStorage("AST001001"),
  "INC001003": GetLeadgerInfoFromLocalStorage("INC001003"),
  "AST002002": GetLeadgerInfoFromLocalStorage("AST002002"),
  "EXP001003": GetLeadgerInfoFromLocalStorage("EXP001003"),
  "EXP001009": GetLeadgerInfoFromLocalStorage("EXP001009"),
  "EXP001011": GetLeadgerInfoFromLocalStorage("EXP001011"),
  "EXP001007": GetLeadgerInfoFromLocalStorage("EXP001007"),
  "LIA001002": GetLeadgerInfoFromLocalStorage("LIA001002"),
  "EXP001024": GetLeadgerInfoFromLocalStorage("EXP001024"),
  "LIA003004": GetLeadgerInfoFromLocalStorage("LIA003004"),
  "INC001006": GetLeadgerInfoFromLocalStorage("INC001006"),
  "AST001002": GetLeadgerInfoFromLocalStorage("AST001002"),
  "AST003001": GetLeadgerInfoFromLocalStorage("AST003001"),
  "INC001008": GetLeadgerInfoFromLocalStorage("INC001008"),
  "AST006002": GetLeadgerInfoFromLocalStorage("AST006002"),
  "INC001015": GetLeadgerInfoFromLocalStorage("INC001015"),
  "INC001009": GetLeadgerInfoFromLocalStorage("INC001009"),
  "LIA001001": GetLeadgerInfoFromLocalStorage("LIA001001"),
  "INC001004": GetLeadgerInfoFromLocalStorage("INC001004"),
  "INC001002": GetLeadgerInfoFromLocalStorage("INC001002"),
  "INC001001": GetLeadgerInfoFromLocalStorage("INC001001"),
  "IGST": GetLeadgerInfoFromLocalStorage("LIA002004"),
  "UGST": GetLeadgerInfoFromLocalStorage("LIA002002"),
  "SGST": GetLeadgerInfoFromLocalStorage("LIA002001"),
  "CGST": GetLeadgerInfoFromLocalStorage("LIA002003"),
};
export const SACInfo = {
  "9964": {
    "sacCode": "9964",
    "sacName": "Passenger Transport Services",
    "GSTRT": 12
  },
  "996511": {
    "sacCode": "996511",
    "sacName": "road transport services of goods",
    "GSTRT": 12
  }
};

export function GetLeadgerInfoFromLocalStorage(LeadgerCode: string) {
  try {
    // Get Data From Local Storage
    const leadgerInfo = JSON.parse(Storage.getItem(StoreKeys.AccountMaster));

    // Check if leadgerInfo is an array
    if (!Array.isArray(leadgerInfo)) {
      throw new Error('LeadgerInfo is not an array');
    }

    // Get Leadger Info
    const result = leadgerInfo.find((x) => x.LeadgerCode === LeadgerCode);

    // Handle the case when the LeadgerCode is not found
    if (!result) {
      console.warn(`LeadgerCode ${LeadgerCode} not found`);
    }

    return result;

  } catch (error) {
    // Log the error
    console.error('Error getting Leadger Info from Local Storage:', error);
    return null; // Return null or handle the error as needed
  }
}
export const GSTTypeMapping = {
  UGST: { accCode: ledgerInfo['LIA002002'].LeadgerCode, accName: ledgerInfo['LIA002002'].LeadgerName, accCategory: ledgerInfo['LIA002002'].LeadgerCategory, prop: "uGST" },
  UTGST: { accCode: ledgerInfo['LIA002002'].LeadgerCode, accName: ledgerInfo['LIA002002'].LeadgerName, accCategory: ledgerInfo['LIA002002'].LeadgerCategory, prop: "uTGST" },
  CGST: { accCode: ledgerInfo['LIA002003'].LeadgerCode, accName: ledgerInfo['LIA002003'].LeadgerName, accCategory: ledgerInfo['LIA002003'].LeadgerCategory, prop: "cGST" },
  IGST: { accCode: ledgerInfo['LIA002004'].LeadgerCode, accName: ledgerInfo['LIA002004'].LeadgerName, accCategory: ledgerInfo['LIA002004'].LeadgerCategory, prop: "iGST" },
  SGST: { accCode: ledgerInfo['LIA002001'].LeadgerCode, accName: ledgerInfo['LIA002001'].LeadgerName, accCategory: ledgerInfo['LIA002001'].LeadgerCategory, prop: "sGST" },
}
