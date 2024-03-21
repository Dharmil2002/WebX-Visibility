export class CreditVoucherRequestModel {
    companyCode: number
    docType: string
    branch: string
    finYear: string
    data: CreditVoucherDataRequestModel
    details: CreditVoucherdetailsRequestModel[]
    debitAgainstDocumentList: CreditAgainstDocumentList[]
}

export class CreditVoucherDataRequestModel {
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
    receivedfrom: string
    partyCode: string
    partyName: string
    entryBy: string
    entryDate: Date
    netPayable: number
    roundOff: number
    voucherCanceled: boolean
    paymentMode: string
    refNo: string
    accountName: string
    accountCode: string
    date: string
    mANNUM: string
    mREFNUM: string
    nAR: string;
}

export class CreditVoucherdetailsRequestModel {
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
    narration: string;
    PaymentMode?: string
}
export class CreditAgainstDocumentList {
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
    CreditAmountAgaintsDocument: string
    DocumentType: string
}