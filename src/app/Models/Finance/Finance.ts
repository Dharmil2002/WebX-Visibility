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
}

export class VoucherDataRequestModel {
  voucherNo: string
  transCode: number
  transType: string
  voucherCode: number
  voucherType: string
  transactionNumber: string = '';
  transDate: Date
  docType: string
  branch: string
  finYear: string
  accLocation: string
  preperedFor: string
  partyCode: string
  partyName: string
  partyState: string
  paymentState: string
  entryBy: string
  entryDate: Date
  panNo: string
  tdsSectionCode: string
  tdsSectionName: string
  tdsRate: number
  tdsAmount: number
  tdsAtlineitem: boolean
  tcsSectionCode: string
  tcsSectionName: string
  tcsRate: number
  tcsAmount: number
  IGST: number
  UGST: number
  SGST: number
  CGST: number
  GSTTotal: number
  GrossAmount: number
  netPayable: number
  roundOff: number
  voucherCanceled: boolean
  paymentMode: string
  refNo: string
  accountName: string
  accountCode: string
  date: string
  scanSupportingDocument: string
  mANNUM: string
  mREFNUM: string
  nAR: string;
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

function GetLeadgerInfoFromLocalStorage(LeadgerCode: string) {
  // Get Data From Local Storage
  const LeadgerInfo = JSON.parse(Storage.getItem(StoreKeys.AccountMaster));

  // Get Leadger Info
  return LeadgerInfo.find((x) => x.LeadgerCode == LeadgerCode);

}