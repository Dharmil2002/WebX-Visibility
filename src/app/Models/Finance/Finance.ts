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
  //accCategory: string
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
}

export const ledgerInfo = {
  "IGST": {
    "LeadgerCode": "LIA002004",
    "LeadgerName": "IGST payable"
  },
  "UGST": {
    "LeadgerCode": "LIA002002",
    "LeadgerName": "UGST payable"
  },
  "SGST": {
    "LeadgerCode": "LIA002001",
    "LeadgerName": "SGST payable"
  },
  "CGST": {
    "LeadgerCode": "LIA002003",
    "LeadgerName": "CGST payable"
  },
  "Round off Amount": {
    "LeadgerCode": "EXP001042",
    "LeadgerName": "Round off Amount"
  },
  "Unbilled debtors": {
    "LeadgerCode": "AST001001",
    "LeadgerName": "Unbilled debtors"
  },
  "Freight income": {
    "LeadgerCode": "INC001003",
    "LeadgerName": "Freight income"
  },
  "Billed debtors": {
    "LeadgerCode": "AST002002",
    "LeadgerName": "Billed debtors"
  },
};
