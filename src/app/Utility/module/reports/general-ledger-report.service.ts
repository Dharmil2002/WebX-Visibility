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
          { transDate: { 'D$gte': data.startValue } }, // Convert start date to ISO format
          { transDate: { 'D$lte': data.endValue } }, // Bill date less than or equal to end date       
          ...(data.state.length > 0 ? [{ 'D$expr': { 'D$in': ['$details.pST', data.state] } }] : []), // State names condition
          ...(data.branch ? [{ 'branch': data.branch }] : []), //branch condition
          // ...(data.category ? [{ 'bRC': data.category }] : []), // category condition
          ...(data.fnYear ? [{ 'finYear': data.fnYear }] : []), // financial year condition
          ...(data.accountCode.length > 0 ? [{ accName: { 'D$in': data.accountCode } }] : []), // account code condition
        ],
      };

      const reqBody = {
        companyCode: this.storage.companyCode,
        collectionName: "acc_trans_2425",
        filters: [
          {
            D$lookup: {
              from: "voucher_trans",
              localField: "docNo",
              foreignField: "docNo",
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
              "eDT": "$details.eDT",
              "rNO": "$details.rNO",
              "dT": "$details.dT",
              "finYear": 1,
              "credit": 1,
              "debit": 1,
              "branch": 1,
              "accCode": 1,
              "accName": 1,
              "narration": 1,
              "docNo": 1,
              //finalized: { D$sum: { D$cond: { if: { D$ne: ['$bSTAT', 1] }, then: '$bALAMT', else: 0 } } },
            }
          }
        ]
      };

      const res = await firstValueFrom(this.masterService.masterMongoPost("generic/query", reqBody));
      // console.log(res.data);
      const reportFile: any = await firstValueFrom(this.masterService.getJsonFileDetails('generalLedgerReport'));

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

      // Add a new row with the specified values
      const newRow = {
        "AccountCode": "Total for A/C (Dr./Cr.) : ",
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

      reportData.push(newRow);

      return reportData;
    } catch (error) {
      console.error("An error occurred:", error);
      return [];
    }
  }
  //#endregion
  //#region to account list
  async getAccountDetail() {
    try {
      const companyCode = this.storage.companyCode;
      const req = { companyCode, collectionName: 'account_detail', filter: {} };

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
  //#region to get financial Year
  getFinancialYear() {
    const currentYear = new Date().getFullYear();
    const currentYearShort: string = `${currentYear % 100}`;
    const nextYearShort: string = `${+currentYearShort + 1}`;
    const previousYearShort: string = `${+currentYearShort - 1}`;

    const financialYear = [
      { name: `${previousYearShort}${currentYearShort}`, value: `${previousYearShort}${currentYearShort}` },
      { name: `${currentYearShort}${nextYearShort}`, value: `${currentYearShort}${nextYearShort}` },
    ];

    return financialYear;
  }
  //#endregion
}