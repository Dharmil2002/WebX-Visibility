import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { prepareReportData } from '../../commonFunction/arrayCommonFunction/arrayCommonFunction';

@Injectable({
  providedIn: 'root'
})
export class GeneralLedgerReportService {

  constructor(private masterService: MasterService,
    private storage: StorageService,) { }
  //#region to filter report Data
  async getGeneralLedger(data) {
    try {

      // Build the match query based on provided conditions          
      let matchQuery = {
        'D$and': [
          {
            vDT: { 'D$gte': data.startValue }
          }, // Convert start date to ISO format
          { vDT: { 'D$lte': data.endValue } }, // Bill date less than or equal to end date       
          ...(data.state.length > 0 ? [{ 'D$expr': { 'D$in': ['$details.pST', data.state] } }] : []), // State names condition
          ...(data?.category ? [{ aCCAT: { 'D$in': [data.category] } }] : []), // account code condition
          ...([{ lOC: { 'D$in': data.branch } }]), //branch condition
          ...(data.fnYear ? [{ 'fY': data.fnYear }] : []), // financial year condition
          ...(data.accountCode.length > 0 ? [{ aCCCD: { 'D$in': data.accountCode } }] : []), // account code condition
        ],
      };

      const reqBody = {
        companyCode: this.storage.companyCode,
        collectionName: `acc_trans_${data.fnYear}`,
        filters: [
          {
            D$lookup: {
              from: "voucher_trans",
              localField: "vNO",
              foreignField: "vNO",
              as: "details",
            }
          },
          {
            D$unwind: "$details"
          },
          { D$match: matchQuery },
          {
            D$project: {
              "vNO": "$details.vNO",
              "pCODE": "$details.pCODE",
              "pNAME": "$details.pNAME",
              "pST": "$details.pST", // Update to use the pST field from voucher_trans
              "eDT": "$details.eNTDT",
              "rNO": "$details.rNO",
              "dT": "$details.dT",
              "fY": 1,
              "cR": 1,
              "dR": 1,
              "lOC": 1,
              "aCCCD": 1,
              "aCCNM": 1,
              "nRT": 1,
              // "docNo": 1,
              //finalized: { D$sum: { D$cond: { if: { D$ne: ['$bSTAT', 1] }, then: '$bALAMT', else: 0 } } },
            }
          }
        ]
      };

      const res = await firstValueFrom(this.masterService.masterMongoPost("generic/query", reqBody));
      // console.log(res.data);
      const reportFile: any = await firstValueFrom(this.masterService.getJsonFileDetails('generalLedgerReport'));

      if (res.data && res.data.length > 0) {
        let reportData: any[] = [];


        reportData = prepareReportData(res.data, reportFile);
        const category = await this.getAccountDetail();

        // Calculate total debit and credit
        const total = reportData.reduce((accumulator, item) => {
          // Update the "Category" property based on the 'category' array
          item["Category"] = category.find(a => a.value == item["Category"])?.category || item["Category"];

          // Update the totals
          accumulator.totalDebit += item.Debit ? parseFloat(item.Debit) : 0;
          accumulator.totalCredit += item.Credit ? parseFloat(item.Credit) : 0;

          return accumulator;
        }, { totalDebit: 0, totalCredit: 0 });

        //Add a new row with the specified values
        const Row = {
          "AccountCode": "Opening Balance :",
          "AccountName": " ",
          "Category": " ",
          "Voucher No": " ",
          "Date": " ",
          "Debit": "0.00",
          "Credit": "0.00",
          "PartyCode": " ",
          "PartyName": " ",
          "Document No": " ",
          "Narration": " ",
          "Cheque No": " ",
          "Cheque Date": " ",
          "LocName": " ",
        };
        reportData.unshift(Row);

        const firstRow = {
          "AccountCode": "Total Transaction :",
          "Debit": total.totalDebit.toFixed(2),
          "Credit": total.totalCredit.toFixed(2),
          "AccountName": " ",
          "Category": " ",
          "Voucher No": " ",
          "Date": " ",
          "PartyCode": " ",
          "PartyName": " ",
          "Narration": " ",
          "LocName": " ",
          "Cheque Date": " ",
          "Document No": " "
        };
        reportData.push(firstRow);

        const isBalanced = total.totalDebit.toFixed(2) === total.totalCredit.toFixed(2);
        const balanceAmount = isBalanced ? 0.00 : (total.totalDebit - total.totalCredit);

        const secondRow = {
          "AccountCode": "Total for A/C (Dr./Cr.) : ",
          "Debit": isBalanced ? "0.00" : (balanceAmount > 0 ? balanceAmount.toFixed(2) : "0.00"),
          "Credit": isBalanced ? "0.00" : (balanceAmount < 0 ? -balanceAmount.toFixed(2) : "0.00"),
          "AccountName": " ",
          "Category": " ",
          "Voucher No": " ",
          "Date": " ",
          "PartyCode": " ",
          "PartyName": " ",
          "Narration": " ",
          "LocName": " ",
          "Cheque Date": " ",
          "Document No": " "
        };

        reportData.push(secondRow);
        const thirdRow = {
          "AccountCode": "Closing Balance : ",
          "Debit": isBalanced ? "0.00" : (balanceAmount > 0 ? balanceAmount.toFixed(2) : "0.00"),
          "Credit": isBalanced ? "0.00" : (balanceAmount < 0 ? -balanceAmount.toFixed(2) : "0.00"),
          "AccountName": " ",
          "Category": " ",
          "Voucher No": " ",
          "Date": " ",
          "PartyCode": " ",
          "PartyName": " ",
          "Narration": " ",
          "LocName": " ",
          "Cheque Date": " ",
          "Document No": " "
        };

        reportData.push(thirdRow);

        return reportData;
      }

    } catch (error) {
      console.error("An error occurred:", error);
    }

    return [];
  }
  //#endregion
  //#region to account list
  async getAccountDetail(filter = {}) {
    try {
      const companyCode = this.storage.companyCode;
      const req = { companyCode, collectionName: 'account_detail', filter: filter };

      const response = await firstValueFrom(this.masterService.masterPost('generic/get', req));
      const accountData = response?.data || [];

      return accountData.map(account => ({
        name: account.aCNM,
        value: account.aCCD,
        category: account.bCATNM
      }));
    } catch (error) {
      console.error('Error in getAccountDetail:', error.message || error);
      return []; // Return an empty array in case of an error or missing data
    }
  }
  //#endregion
  async GetReportingLocationsList(location) {
    try {
      const reqBody = {
        companyCode: this.storage.companyCode,
        collectionName: "location_detail",
        filters: [
          { D$match: { reportLoc: location } },
          {
            D$project: {
              "_id": 0,
              "locCode": 1,
            }
          }
        ]
      };
      const response = await firstValueFrom(this.masterService.masterMongoPost("generic/query", reqBody));
      return response?.data?.map(item => item.locCode) || [];
    } catch (error) {
      console.error('Error in getAccountDetail:', error.message || error);
      return []; // Return an empty array in case of an error or missing data
    }
  }
  //#endregio
  //#region to get financial Year
  getFinancialYear() {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const previousYear = currentYear - 1;

    const financialYear = [
      { name: `${previousYear}-${currentYear}`, value: `${String(previousYear).slice(-2)}${String(currentYear).slice(-2)}` },
      { name: `${currentYear}-${nextYear}`, value: `${String(currentYear).slice(-2)}${String(currentYear + 1).slice(-2)}` },
    ];

    return financialYear;
  }
  //#endregion
}