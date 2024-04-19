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
  "IGST": {
    "LeadgerCode": "LIA002004",
    "LeadgerName": "IGST payable",
    "LeadgerCategory": "LIABILITY"
  },
  "UGST": {
    "LeadgerCode": "LIA002002",
    "LeadgerName": "UGST payable",
    "LeadgerCategory": "LIABILITY"
  },
  "SGST": {
    "LeadgerCode": "LIA002001",
    "LeadgerName": "SGST payable",
    "LeadgerCategory": "LIABILITY"
  },
  "CGST": {
    "LeadgerCode": "LIA002003",
    "LeadgerName": "CGST payable",
    "LeadgerCategory": "LIABILITY"
  },
  "Round off Amount": {
    "LeadgerCode": "EXP001042",
    "LeadgerName": "Round off Amount",
    "LeadgerCategory": "EXPENSE"
  },
  "Unbilled debtors": {
    "LeadgerCode": "AST001001",
    "LeadgerName": "Unbilled debtors",
    "LeadgerCategory": "ASSET"
  },
  "Freight income": {
    "LeadgerCode": "INC001003",
    "LeadgerName": "Freight income",
    "LeadgerCategory": "INCOME"
  },
  "Billed debtors": {
    "LeadgerCode": "AST002002",
    "LeadgerName": "Billed debtors",
    "LeadgerCategory": "ASSET"
  },
  "Contract Charges": {
    "LeadgerCode": "EXP001003",
    "LeadgerName": "Contract Charges",
    "LeadgerCategory": "EXPENSE"
  },
  "Other Charges": {
    "LeadgerCode": "EXP001009",
    "LeadgerName": "Other Charges",
    "LeadgerCategory": "EXPENSE"
  },
  "Loading Charge": {
    "LeadgerCode": "EXP001011",
    "LeadgerName": "Loading Charge",
    "LeadgerCategory": "EXPENSE"
  },
  "Unloading Charges": {
    "LeadgerCode": "EXP001011",
    "LeadgerName": "Unloading Charges",
    "LeadgerCategory": "EXPENSE"
  },
  "Enroute Charges": {
    "LeadgerCode": "EXP001007",
    "LeadgerName": "Enroute Charges",
    "LeadgerCategory": "EXPENSE"
  },
  "Miscellaneous Charges": {
    "LeadgerCode": "EXP001009",
    "LeadgerName": "Miscellaneous Charges",
    "LeadgerCategory": "EXPENSE"
  },
  "Billed creditors": {
    "LeadgerCode": "LIA001002",
    "LeadgerName": "Billed creditors",
    "LeadgerCategory": "EXPENSE"
  },
  "Inter branch control": {
    "LeadgerCode": "EXP001024",
    "LeadgerName": "Inter branch control",
    "LeadgerCategory": "EXPENSE"
  },
  "Transport Expense": {
    "LeadgerCode": "EXP001003",
    "LeadgerName": "Transport Expense",
    "LeadgerCategory": "EXPENSE"
  },

};
