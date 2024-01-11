export class DebitVoucherRequestModel {
  companyCode: number
  docType: string
  branch: string
  finYear: string
  data: DebitVoucherDataRequestModel
  details: DebitVoucherdetailsRequestModel[]
  debitAgainstDocumentList: DebitAgainstDocumentList[]
}

export class DebitVoucherDataRequestModel {
  //companyCode: number
  voucherNo: string
  transType: string
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
  paymentAmt: number
  netPayable: number
  roundOff: number
  voucherCanceled: boolean
  paymentMode: string
  refNo: string
  accountName: string
  date: string
  scanSupportingDocument: string
  paymentAmount: number
  mANNUM: string
  mREFNUM: string
  nAR: string;
}

export class DebitVoucherdetailsRequestModel {
  companyCode: number
  voucherNo: string
  transType: string
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
  transType: string
  transDate: string
  finYear: string
  branch: string
  Document: string
  DebitAmountAgaintsDocument: string
  DocumentType: string
}
