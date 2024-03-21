import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { filter } from 'rxjs/operators';
@Injectable({
     providedIn: 'root'
})
export class AccountReportService {
     jsonData: any;
     constructor(private masterService: MasterService,
          private storage: StorageService,) { }
     async ProfitLossStatement(request) {

          const reqBody = {
               companyCode: this.storage.companyCode,
               collectionName: "account_detail",
               filters: [
                    {
                         'D$match': {
                              'D$or': [
                                   {
                                        'mATCD': {
                                             'D$in': [
                                                  'MCT-0003', 'MCT-0005'
                                             ]
                                        }
                                   }, {
                                        'gRPCD': {
                                             'D$in': [
                                                  'AST005', 'LIA004'
                                             ]
                                        }
                                   }
                              ]
                         }
                    },
                    {
                         "D$lookup": {
                              "from": "acc_trans_2425",
                              "let": { "aCCCD": "$aCCD" },
                              "pipeline": [
                                   {
                                        "D$match": {
                                             "D$expr": {
                                                  "D$and": [
                                                       {
                                                            "D$eq": [
                                                                 "$aCCCD",
                                                                 "$$aCCCD"
                                                            ]
                                                       },
                                                       {
                                                            "D$in": [
                                                                 "$lOC",
                                                                 request.branch
                                                            ]
                                                       },
                                                       {
                                                            '$gte': [
                                                                 '$vDT', request.startdate
                                                            ]
                                                       }, {
                                                            '$lte': [
                                                                 '$vDT', request.enddate
                                                            ]
                                                       }

                                                  ]
                                             }
                                        }
                                   }
                              ],
                              "as": "transactions"
                         }
                    },
                    {
                         "D$unwind": "$transactions"
                    },
                    {
                         "D$match": {
                              "transactions": { "D$ne": [] } // Filter out documents where there are no transactions
                         }
                    },

                    {
                         "D$group": {
                              "_id": {
                                   "MainCategory": "$mRPNM",
                                   "SubCategory": "$gRPNM",
                                   "AccountCode": "$aCCD",
                                   "AccountName": "$aCNM",
                                   "bSSCH": "$bSSCH"
                              },
                              "TotalCredit": {
                                   "D$sum": "$transactions.cR"
                              },
                              "TotalDebit": {
                                   "D$sum": "$transactions.dR"
                              }
                         }
                    },
                    {
                         "D$group": {
                              "_id": {
                                   "MainCategory": "$_id.MainCategory",
                                   "SubCategory": "$_id.SubCategory",
                                   "bSSCH": "$_id.bSSCH"
                              },
                              "TotalCredit": {
                                   "D$sum": "$TotalCredit"
                              },
                              "TotalDebit": {
                                   "D$sum": "$TotalDebit"
                              },
                              "AccountDetails": {
                                   "D$push": {
                                        "AccountCode": "$_id.AccountCode",
                                        "AccountName": "$_id.AccountName",
                                        "Credit": "$TotalCredit",
                                        "Debit": "$TotalDebit"
                                   }
                              }
                         }
                    },
                    {
                         "D$group": {
                              "_id": "$_id.MainCategory",
                              "Details": {
                                   "D$push": {
                                        "bSSCH": "$_id.bSSCH",
                                        "SubCategory": "$_id.SubCategory",
                                        "TotalCredit": "$TotalCredit",
                                        "TotalDebit": "$TotalDebit",
                                        "AccountDetails": "$AccountDetails"
                                   }
                              }
                         }
                    },
                    {
                         "D$project": {
                              "_id": 0,
                              "MainCategory": "$_id",
                              "Details": 1
                         }
                    }
               ]
          };
          try {
               const res = await firstValueFrom(this.masterService.masterMongoPost("generic/query", reqBody));
               if (res.data && res.data.length > 0) {
                    let ASSETAndLiabilities = res.data.filter(item => ['ASSET', 'LIABILITY'].includes(item.MainCategory));
                    let OthersData = res.data.filter(item => !['ASSET', 'LIABILITY'].includes(item.MainCategory));

                    let reportData = OthersData.sort((a, b) => {
                         if (a.MainCategory < b.MainCategory) return 1;
                         if (a.MainCategory > b.MainCategory) return -1;
                         return 0;
                    });
                    const TotalAmountLastFinYear = 0.00;
                    const NewTableList = reportData.flatMap((entry, index) => {
                         const mainRow = {
                              MainCategory: `${index + 1}. ${entry.MainCategory}`,
                              MainCategoryWithoutIndex: entry.MainCategory,
                              SubCategory: 'Total',
                              SubCategoryWithoutIndex: '',
                              TotalAmountCurrentFinYear: (entry.Details.reduce((acc, item) => acc + item.TotalCredit, 0) - entry.Details.reduce((acc, item) => acc + item.TotalDebit, 0)).toFixed(2),
                              TotalAmountLastFinYear: TotalAmountLastFinYear.toFixed(2),
                              Notes: '-',
                              AccountDetails: '',
                         };
                         entry.Details.sort((a, b) => {
                              if (a.Notes > b.Notes) return 1;
                              if (a.Notes < b.Notes) return -1;
                              return 0;
                         });
                         const subCategoryRows = entry.Details.map((subCategory, subindex) => ({
                              MainCategory: '',
                              MainCategoryWithoutIndex: '',
                              SubCategory: `[${index + 1}.${subindex + 1}] ${subCategory.SubCategory}`,
                              SubCategoryWithoutIndex: subCategory.SubCategory,
                              TotalAmountCurrentFinYear: (subCategory.TotalCredit - subCategory.TotalDebit).toFixed(2),
                              TotalAmountLastFinYear: TotalAmountLastFinYear.toFixed(2),
                              Notes: subCategory.bSSCH,
                              AccountDetails: subCategory.AccountDetails
                         }));

                         return [mainRow, ...subCategoryRows];
                    });


                    return { "MainData": NewTableList, "TaxDetails": ASSETAndLiabilities };
               }
          } catch (error) {
               console.error("Error:", error);
               throw error;
          }
     }

     setData(data: any) {
          this.storage.setItem("PLReportsData", JSON.stringify(data));
     }

     getData() {
          return this.storage.getItem("PLReportsData");
     }
}