import { StoreKeys } from 'src/app/config/myconstants';
import * as Storage from 'src/app/core/service/storage.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { HttpClient } from '@angular/common/http';
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
  "LIA002004": {
    "LeadgerCode": "LIA002004",
    "LeadgerName": "IGST payable",//GetLeadgerDeatilfromAPI("LIA002004"),
    "LeadgerCategory": "LIABILITY"
  },
  "LIA002002": {
    "LeadgerCode": "LIA002002",
    "LeadgerName": "UGST payable",
    "LeadgerCategory": "LIABILITY"
  },
  "LIA002001": {
    "LeadgerCode": "LIA002001",
    "LeadgerName": "SGST payable",
    "LeadgerCategory": "LIABILITY"
  },
  "LIA002003": {
    "LeadgerCode": "LIA002003",
    "LeadgerName": "CGST payable",
    "LeadgerCategory": "LIABILITY"
  },
  "EXP001042": {
    "LeadgerCode": "EXP001042",
    "LeadgerName": "Round off Amount",
    "LeadgerCategory": "EXPENSE"
  },
  "AST001001": {
    "LeadgerCode": "AST001001",
    "LeadgerName": "Unbilled debtors",
    "LeadgerCategory": "ASSET"
  },
  "INC001003": {
    "LeadgerCode": "INC001003",
    "LeadgerName": "Freight income",
    "LeadgerCategory": "INCOME"
  },
  "AST002002": {
    "LeadgerCode": "AST002002",
    "LeadgerName": "Billed debtors",
    "LeadgerCategory": "ASSET"
  },
  "EXP001003": {
    "LeadgerCode": "EXP001003",
    "LeadgerName": "Contract Charges",
    "LeadgerCategory": "EXPENSE"
  },
  "EXP001009": {
    "LeadgerCode": "EXP001009",
    "LeadgerName": "Other Charges",
    "LeadgerCategory": "EXPENSE"
  },
  "EXP001011": {
    "LeadgerCode": "EXP001011",
    "LeadgerName": "Loading Charge",
    "LeadgerCategory": "EXPENSE"
  },

  "EXP001007": {
    "LeadgerCode": "EXP001007",
    "LeadgerName": "Enroute Charges",
    "LeadgerCategory": "EXPENSE"
  },

  "LIA001002": {
    "LeadgerCode": "LIA001002",
    "LeadgerName": "Billed creditors",
    "LeadgerCategory": "EXPENSE"
  },
  "EXP001024": {
    "LeadgerCode": "EXP001024",
    "LeadgerName": "Inter branch control",
    "LeadgerCategory": "EXPENSE"
  },


};

async function GetLeadgerDeatilfromAPI(data: string) {
  // Call API and get Data Of Account Master
  try {
    const masterService = new MasterService(new HttpClient(null));
    debugger
    const companyCode = Storage.getItem(StoreKeys.CompanyCode);
    const filter = {
      aCCD: data,
    };
    const req = { companyCode, collectionName: 'account_detail', filter };
    const res = await masterService.masterPost('generic/get', req).toPromise();
    if (res && res.data) {
      return res.data.map(x => ({
        name: x.aCNM, value: x.aCCD, ...x
      }));
    }
    console.log('Data fetched from API:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching data from API:', error);
    return null; // Return null or handle the error as needed
  }
}