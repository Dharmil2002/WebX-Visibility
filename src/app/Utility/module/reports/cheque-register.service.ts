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

  //#region to get cheque register report data as per the query
  async getChequeRegister(data, optionalRequest) {

    const hasStartAmt = optionalRequest.startAmt !== '' && optionalRequest.startAmt !== undefined;
    const hasDocNo = optionalRequest.docNoArray.some(value => value !== '' && value !== undefined);

    const isEmptyDocNo = !hasStartAmt && !hasDocNo;

    let matchQuery

    if (isEmptyDocNo) {
      matchQuery = {
        'D$and': [
          { pMD: { 'D$in': ['Cheque', 'Bank', 'NEFT', 'RTGS', 'UPI'] } },

          // DateType conditions
          data.DateType === 'ChequeDate'
            ? { dT: { 'D$gte': data.startValue, 'D$lte': data.endValue } }
            : data.DateType === 'EntryDate'
              ? { eNTDT: { 'D$gte': data.startValue, 'D$lte': data.endValue } }
              : { dT: { 'D$gte': data.startValue, 'D$lte': data.endValue } },
          // Branch condition
          ...(data.branch.length > 0 ? [{ lOC: { 'D$in': data.branch } }] : []),
          // party condition
          ...(data.party.length > 0 ? [{ pCODE: { 'D$in': data.party } }] : []),
          // Bank condition
          ...(data.bank.length > 0 ? [{ aNM: { 'D$in': data.bank } }] : []),
        ]
      };

    }


    if (!isEmptyDocNo) {
      matchQuery = {
        'D$and': []
      };

      // Condition: rNO in optionalRequest.docNoArray
      if (optionalRequest.docNoArray && optionalRequest.docNoArray.length > 0) {
        matchQuery['D$and'].push({ 'rNO': { 'D$in': optionalRequest.docNoArray } });
      }

      // Condition: details.tOT greater than or equal to optionalRequest.startAmt
      if (optionalRequest.startAmt !== undefined) {
        matchQuery['D$and'].push({ 'D$expr': { 'D$gte': ['$nNETP', optionalRequest.startAmt] } });
      }

      // Condition: details.tOT less than or equal to optionalRequest.endAmt
      if (optionalRequest.endAmt !== undefined) {
        matchQuery['D$and'].push({ 'D$expr': { 'D$lte': ['$nNETP', optionalRequest.endAmt] } });
      }
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
          D$match: matchQuery
        },
        {
          D$addFields: {
            IssuedToVendor: { D$concat: [{ D$toString: "$pCODE", }, " : ", "$pNAME",], }
          },
        },
        {
          D$lookup: {
            from: "account_detail",
            localField: "details.aCOD",
            foreignField: "aCCD",
            as: "accountDetails",
          },
        },
        {
          D$match: {
            "accountDetails": { D$exists: true, D$not: { D$size: 0 } },
            "accountDetails.cATNM": "BANK",
          },
        },
        {
          D$project: {
            _id: 0, // Exclude the _id field
            ChequeNo: { D$ifNull: ["$rNO", ""] },
            ChequeDate: { D$ifNull: ["$dT", ""] },
            ChequeEntryDate: { D$ifNull: ["$eNTDT", ""] },
            Amount: { D$ifNull: ["$nNETP", "0.00"] },
            IssuedFromBank: { D$ifNull: ["$aNM", ""] },
            IssuedToVendor: { D$ifNull: ["$IssuedToVendor", ""] },
            IssuedAtLocation: { D$ifNull: ["$lOC", ""] },
            TransactionDocumentNo: { D$ifNull: ["$vNO", ""] },
            TransactionDocumentDate: { D$ifNull: ["$tTDT", ""] },
            TransactionType: { D$ifNull: ["$tTYPNM", ""] },
            ChequeStatus: "",
            OnAccount: "N",
            UsedAmount: { D$ifNull: ["$nNETP", ""] },
            EnteredBy: { D$ifNull: ["$eNTBY", ""] },
          }
        }
      ]
    };

    const res = await firstValueFrom(this.masterService.masterMongoPost("generic/query", reqBody));

    res.data.forEach(item => {

      item.ChequeDate = item.ChequeDate ? moment(item.ChequeDate).format('DD MMM YY') : '';
      item.ChequeEntryDate = item.ChequeEntryDate ? moment(item.ChequeEntryDate).format('DD MMM YY') : '';
      item.TransactionDocumentDate = item.TransactionDocumentDate ? moment(item.TransactionDocumentDate).format('DD MMM YY') : '';
    });

    return res.data;
  }
  //#endregion
}