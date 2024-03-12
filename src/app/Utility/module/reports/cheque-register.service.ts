import { Injectable } from '@angular/core';
import moment from 'moment';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ChequeRegisterService {

  constructor(private masterService: MasterService,
    private storage: StorageService,) { }

  async getChequeRegister(data, optionalRequest) {
    console.log(data);
    console.log(`optionalRequest${optionalRequest}`);

    // Check if the array contains only empty strings
    // const isEmptyDocNo = (data.vNoArray.length === 1 && data.vNoArray[0].length === 0) && (data.docNoArray.length === 1 && data.docNoArray[0].length === 0);

    const isEmptyDocNo = optionalRequest.docNoArray.every(value => value === "") && (optionalRequest.startAmt === '') 
    // || optionalRequest.startAmt;
    console.log(isEmptyDocNo);

    let matchQuery
    if (isEmptyDocNo) {
      matchQuery = {
        'D$and': [
          { pMD: { 'D$in': ['Cheque', 'NEFT', 'RTGS', 'UPI'] } },

          // DateType conditions
          data.DateType === 'ChequeDate'
            ? { dT: { 'D$gte': data.startValue, 'D$lte': data.endValue } }

            : data.DateType === 'EntryDate'
              ? { eNTDT: { 'D$gte': data.startValue, 'D$lte': data.endValue } }

              : { dT: { 'D$gte': data.startValue, 'D$lte': data.endValue } },

          // Branch condition
          ...(data.branch.length > 0 ? [{ lOC: { 'D$in': data.branch } }] : []),

          // Customer condition
          ...(data.customer.length > 0 ? [{ pCODE: { 'D$in': data.customer } }] : []),

          // Vendor condition
          ...(data.vendor.length > 0 ? [{ pCODE: { 'D$in': data.vendor } }] : []),

          // Bank condition
          ...(data.bank.length > 0 ? [{ 'D$expr': { 'D$in': ['$details.aCOD', data.bank] } }] : []),
        ],
      };
    }
    if (!isEmptyDocNo) {
      matchQuery = {
        'D$or': [
          // Condition: rNO in optionalRequest.docNoArray
          { 'rNO': { 'D$in': optionalRequest.docNoArray } },

          // Condition: details.tOT greater than or equal to optionalRequest.startAmt
          { 'D$expr': { 'D$gte': ['$details.tOT', optionalRequest.startAmt] } },

          // Condition: details.tOT less than or equal to optionalRequest.endAmt
          { 'D$expr': { 'D$lte': ['$details.tOT', optionalRequest.endAmt] } }
        ]
      };
    }
    const reqBody = {
      companyCode: this.storage.companyCode,
      collectionName: "voucher_trans",
      filters: [
        {
          D$lookup: {
            from: "voucher_trans_details",
            localField: "vNO",
            foreignField: "vNO",
            as: "details",
          }
        },
        {
          D$unwind: "$details"
        },
        {
          D$match: matchQuery
        },
        {
          D$addFields: {
            IssuedToVendor: {
              D$concat: [
                {
                  D$toString: "$pCODE",
                },
                " : ",
                "$pNAME",
              ],
            },

          },
        },
        {
          D$project: {
            _id: 0, // Exclude the _id field
            ChequeNo: "$rNO",
            ChequeDate: "$dT",
            ChequeEntryDate: "$eNTDT",
            Amount: "$details.tOT",
            IssuedFromBank: "$details.aNM",
            IssuedToVendor: "$IssuedToVendor",
            IssuedAtLocation: "$lOC",
            TransactionDocumentNo: "$vTNO",
            TransactionDocumentDate: "$tTDT",
            TransactionType: "$tTYPNM",
            ChequeStatus: "",
            OnAccount: "N",
            UsedAmount: "$details.tOT",
            EnteredBy: "$eNTBY"
          }
        }
      ]
    };

    const res = await firstValueFrom(this.masterService.masterMongoPost("generic/query", reqBody));
    res.data.forEach(item => {

      item.ChequeDate = item.ChequeDate ? moment(item.ChequeDate).format('YYYY-MM-DD') : '';
      item.ChequeEntryDate = item.ChequeEntryDate ? moment(item.ChequeEntryDate).format('YYYY-MM-DD') : '';
      item.TransactionDocumentDate = item.TransactionDocumentDate ? moment(item.TransactionDocumentDate).format('YYYY-MM-DD') : '';
    });

    return res.data;
  }
}
