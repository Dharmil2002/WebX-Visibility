import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { filter, map } from 'rxjs/operators';
import { format } from 'date-fns';
import moment from 'moment';
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
                              "from": "acc_trans_" + request.FinanceYear,
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
                                                            'D$gte': [
                                                                 '$vDT', request.startdate
                                                            ]
                                                       }, {
                                                            'D$lte': [
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
                              TotalAmountCurrentFinYear: Number(
                                   (entry.Details.reduce((acc, item) => acc + parseFloat(item.TotalCredit), 0) -
                                        entry.Details.reduce((acc, item) => acc + parseFloat(item.TotalDebit), 0)).toFixed(2)
                              ),
                              TotalAmountLastFinYear: TotalAmountLastFinYear.toFixed(2),
                              Notes: '',
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

     async GetTrialBalanceStatement(request) {

          const reqBody: {
               companyCode: number;
               collectionName: string;
               filters: any[]; // Explicitly declare filters as an array
          } = {
               companyCode: this.storage.companyCode,
               collectionName: "account_detail",
               filters: this.GetTypeWiseFilter(request)
          };
          let matchQuery = {
               'D$match': { 'aCCD': { 'D$in': request.accountCode } }
          };
          // Insert matchQuery at position 0
          if (request.accountCode.length > 0) {
               reqBody.filters.splice(0, 0, matchQuery);
          }
          try {
               const res = await firstValueFrom(this.masterService.masterMongoPost("generic/query", reqBody));
               if (res.data && res.data.length > 0) {
                    let OthersData = res.data;

                    let mappedData: any;
                    let SortedData: any;
                    switch (request.ReportType) {
                         case "G":
                              SortedData = OthersData.sort((a, b) => {
                                   if (a.MainCategory < b.MainCategory) return 1;
                                   if (a.MainCategory > b.MainCategory) return -1;
                                   return 0;
                              });
                              const totalRows = {};
                              const processedData = SortedData.flatMap(item => {
                                   const mainCategory = item.MainCategory;

                                   // Process details for the current MainCategory
                                   const detailsWithTotal = item.Details.flatMap(detail => {
                                        const accountDetails = detail.AccountDetails.map(account => ({
                                             MainCategory: mainCategory,
                                             BalanceCategoryName: detail.BalanceCategoryName,
                                             GroupName: detail.GroupCode + ":" + detail.GroupName,
                                             Description: account.AccountCode + ":" + account.AccountName,
                                             TransactionDebit: parseFloat(account.Debit).toFixed(2),
                                             TransactionCredit: parseFloat(account.Credit).toFixed(2),
                                             OpeningDebit: 0,
                                             OpeningCredit: 0,
                                             ClosingDebit: 0,
                                             ClosingCredit: 0,
                                             BalanceAmount: 0,
                                             AccountCode: account.AccountCode
                                        }));

                                        if (!totalRows[mainCategory]) {
                                             totalRows[mainCategory] = {
                                                  Category: mainCategory,
                                                  MainCategory: "Total",
                                                  BalanceCategoryName: "",
                                                  GroupName: "",
                                                  Description: "",
                                                  TransactionDebit: 0,
                                                  TransactionCredit: 0,
                                                  OpeningDebit: 0,
                                                  OpeningCredit: 0,
                                                  ClosingDebit: 0,
                                                  ClosingCredit: 0,
                                                  BalanceAmount: 0,
                                             };
                                        }

                                        // Convert to number before adding
                                        totalRows[mainCategory].TransactionDebit = (parseFloat(totalRows[mainCategory].TransactionDebit) + parseFloat(detail.AccountDetails.reduce((total, account) => total + parseFloat(account.Debit), 0))).toFixed(2);
                                        totalRows[mainCategory].TransactionCredit = (parseFloat(totalRows[mainCategory].TransactionCredit) + parseFloat(detail.AccountDetails.reduce((total, account) => total + parseFloat(account.Credit), 0))).toFixed(2);

                                        return accountDetails;
                                   });

                                   // Add total row for the current MainCategory immediately after its data
                                   const totalRow = totalRows[mainCategory];
                                   if (totalRow) {
                                        return [...detailsWithTotal, totalRow];
                                   } else {
                                        return detailsWithTotal;
                                   }
                              });


                              return processedData
                         case "L":
                              mappedData = OthersData.flatMap((item, index) =>
                                   item.Details.flatMap((detail, detailIndex) =>
                                        detail.AccountDetails.map((account, accountIndex) => {
                                             return {
                                                  LocationWise: item.LocationWise,
                                                  MainCategory: item.MainCategory,
                                                  GroupName: detail.GroupCode + ":" + detail.GroupName,
                                                  Description: account.AccountCode + ":" + account.AccountName,
                                                  TransactionDebit: (account.Debit).toFixed(2),
                                                  TransactionCredit: (account.Credit).toFixed(2),
                                                  OpeningDebit: 0,
                                                  OpeningCredit: 0,
                                                  ClosingDebit: 0,
                                                  ClosingCredit: 0,
                                                  BalanceAmount: 0,
                                                  AccountCode: account.AccountCode
                                             };
                                        })
                                   )
                              );
                              return mappedData.sort((a, b) => {
                                   // Sort by LocationWise ascending
                                   if (a.LocationWise < b.LocationWise) return -1;
                                   if (a.LocationWise > b.LocationWise) return 1;

                                   // If LocationWise is the same, sort by MainCategory ascending
                                   if (a.MainCategory < b.MainCategory) return -1;
                                   if (a.MainCategory > b.MainCategory) return 1;

                                   return 0;
                              });
                              break;
                         case "C":
                              mappedData = OthersData.flatMap((item, index) =>
                                   item.Details.flatMap((detail, detailIndex) =>
                                        detail.AccountDetails.map((account, accountIndex) => {
                                             return {
                                                  PartyDetails: item.PartyDetails,
                                                  MainCategory: item.MainCategory,
                                                  GroupName: detail.GroupCode + ":" + detail.GroupName,
                                                  Description: account.AccountCode + ":" + account.AccountName,
                                                  TransactionDebit: (account.Debit).toFixed(2),
                                                  TransactionCredit: (account.Credit).toFixed(2),
                                                  OpeningDebit: 0,
                                                  OpeningCredit: 0,
                                                  ClosingDebit: 0,
                                                  ClosingCredit: 0,
                                                  BalanceAmount: 0,
                                                  AccountCode: account.AccountCode
                                             };
                                        })
                                   )
                              );
                              return mappedData.sort((a, b) => {
                                   // Sort by PartyDetails ascending
                                   if (a.PartyDetails < b.PartyDetails) return -1;
                                   if (a.PartyDetails > b.PartyDetails) return 1;

                                   // If PartyDetails is the same, sort by MainCategory ascending
                                   if (a.MainCategory < b.MainCategory) return -1;
                                   if (a.MainCategory > b.MainCategory) return 1;

                                   return 0;
                              });
                              break;
                         case "V":
                              mappedData = OthersData.flatMap((item, index) =>
                                   item.Details.flatMap((detail, detailIndex) =>
                                        detail.AccountDetails.map((account, accountIndex) => {
                                             return {
                                                  PartyDetails: item.PartyDetails,
                                                  MainCategory: item.MainCategory,
                                                  GroupName: detail.GroupCode + ":" + detail.GroupName,
                                                  Description: account.AccountCode + ":" + account.AccountName,
                                                  TransactionDebit: (account.Debit).toFixed(2),
                                                  TransactionCredit: (account.Credit).toFixed(2),
                                                  OpeningDebit: 0,
                                                  OpeningCredit: 0,
                                                  ClosingDebit: 0,
                                                  ClosingCredit: 0,
                                                  BalanceAmount: 0,
                                                  AccountCode: account.AccountCode
                                             };
                                        })
                                   )
                              );
                              return mappedData.sort((a, b) => {
                                   // Sort by PartyDetails ascending
                                   if (a.PartyDetails < b.PartyDetails) return -1;
                                   if (a.PartyDetails > b.PartyDetails) return 1;

                                   // If PartyDetails is the same, sort by MainCategory ascending
                                   if (a.MainCategory < b.MainCategory) return -1;
                                   if (a.MainCategory > b.MainCategory) return 1;

                                   return 0;
                              });
                              break;
                         case "E":
                              mappedData = OthersData.flatMap((item, index) =>
                                   item.Details.flatMap((detail, detailIndex) =>
                                        detail.AccountDetails.map((account, accountIndex) => {
                                             return {
                                                  EmployeeWise: item.EmployeeWise,
                                                  MainCategory: item.MainCategory,
                                                  GroupName: detail.GroupCode + ":" + detail.GroupName,
                                                  Description: account.AccountCode + ":" + account.AccountName,
                                                  TransactionDebit: (account.Debit).toFixed(2),
                                                  TransactionCredit: (account.Credit).toFixed(2),
                                                  OpeningDebit: 0,
                                                  OpeningCredit: 0,
                                                  ClosingDebit: 0,
                                                  ClosingCredit: 0,
                                                  BalanceAmount: 0,
                                                  AccountCode: account.AccountCode
                                             };
                                        })
                                   )
                              );
                              return mappedData.sort((a, b) => {
                                   // Sort by EmployeeWise ascending
                                   if (a.EmployeeWise < b.EmployeeWise) return -1;
                                   if (a.EmployeeWise > b.EmployeeWise) return 1;

                                   // If EmployeeWise is the same, sort by MainCategory ascending
                                   if (a.MainCategory < b.MainCategory) return -1;
                                   if (a.MainCategory > b.MainCategory) return 1;

                                   return 0;
                              });
                              break;
                    }
               } else {
                    return []

               }
          } catch (error) {
               console.error("Error:", error);
               throw error;
          }
     }

     GetTypeWiseFilter(request) {

          switch (request.ReportType) {
               case "G":
                    return [
                         {
                              "D$lookup": {
                                   "from": "acc_trans_" + request.FinanceYear,
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
                                                                 'D$gte': [
                                                                      '$vDT', request.startdate
                                                                 ]
                                                            },
                                                            {
                                                                 'D$lte': [
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
                              'D$group': {
                                   '_id': {
                                        'MainCategory': '$mRPNM',
                                        'GroupName': '$gRPNM',
                                        'GroupCode': '$gRPCD',
                                        'BalanceCategoryCode': '$bCATCD',
                                        'BalanceCategoryName': '$bCATNM',
                                        'AccountCode': '$aCCD',
                                        'AccountName': '$aCNM'
                                   },
                                   'TotalCredit': {
                                        'D$sum': '$transactions.cR'
                                   },
                                   'TotalDebit': {
                                        'D$sum': '$transactions.dR'
                                   }
                              }
                         }, {
                              'D$group': {
                                   '_id': {
                                        'MainCategory': '$_id.MainCategory',
                                        'GroupName': '$_id.GroupName',
                                        'GroupCode': '$_id.GroupCode',
                                        'BalanceCategoryCode': '$_id.BalanceCategoryCode',
                                        'BalanceCategoryName': '$_id.BalanceCategoryName'
                                   },
                                   'TotalCredit': {
                                        'D$sum': '$TotalCredit'
                                   },
                                   'TotalDebit': {
                                        'D$sum': '$TotalDebit'
                                   },
                                   'AccountDetails': {
                                        'D$push': {
                                             'AccountCode': '$_id.AccountCode',
                                             'AccountName': '$_id.AccountName',
                                             'Credit': '$TotalCredit',
                                             'Debit': '$TotalDebit'
                                        }
                                   }
                              }
                         }, {
                              'D$group': {
                                   '_id': '$_id.MainCategory',
                                   'Details': {
                                        'D$push': {
                                             'GroupName': '$_id.GroupName',
                                             'GroupCode': '$_id.GroupCode',
                                             'BalanceCategoryCode': '$_id.BalanceCategoryCode',
                                             'BalanceCategoryName': '$_id.BalanceCategoryName',
                                             'TotalCredit': '$TotalCredit',
                                             'TotalDebit': '$TotalDebit',
                                             'AccountDetails': '$AccountDetails'
                                        }
                                   }
                              }
                         }, {
                              'D$project': {
                                   '_id': 0,
                                   'MainCategory': '$_id',
                                   'Details': 1
                              }
                         }
                    ]
               case "L":
                    return [
                         {
                              "D$lookup": {
                                   "from": "acc_trans_" + request.FinanceYear,
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
                                                                 'D$gte': [
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
                              'D$group': {
                                   '_id': {
                                        'LocationWise': '$transactions.lOC',
                                        'MainCategory': '$mRPNM',
                                        'GroupCode': '$gRPCD',
                                        'GroupName': '$gRPNM',
                                        'AccountCode': '$aCCD',
                                        'AccountName': '$aCNM'
                                   },
                                   'TotalCredit': {
                                        'D$sum': '$transactions.cR'
                                   },
                                   'TotalDebit': {
                                        'D$sum': '$transactions.dR'
                                   }
                              }
                         }, {
                              'D$group': {
                                   '_id': {
                                        'LocationWise': '$_id.LocationWise',
                                        'MainCategory': '$_id.MainCategory',
                                        'GroupCode': '$_id.GroupCode',
                                        'GroupName': '$_id.GroupName'
                                   },
                                   'TotalCredit': {
                                        'D$sum': '$TotalCredit'
                                   },
                                   'TotalDebit': {
                                        'D$sum': '$TotalDebit'
                                   },
                                   'AccountDetails': {
                                        'D$push': {
                                             'AccountCode': '$_id.AccountCode',
                                             'AccountName': '$_id.AccountName',
                                             'Credit': '$TotalCredit',
                                             'Debit': '$TotalDebit'
                                        }
                                   }
                              }
                         }, {
                              'D$group': {
                                   '_id': {
                                        'LocationWise': '$_id.LocationWise',
                                        'MainCategory': '$_id.MainCategory'
                                   },
                                   'Details': {
                                        'D$push': {
                                             'GroupCode': '$_id.GroupCode',
                                             'GroupName': '$_id.GroupName',
                                             'TotalCredit': '$TotalCredit',
                                             'TotalDebit': '$TotalDebit',
                                             'AccountDetails': '$AccountDetails'
                                        }
                                   }
                              }
                         }, {
                              'D$project': {
                                   '_id': 0,
                                   'MainCategory': '$_id.MainCategory',
                                   'LocationWise': '$_id.LocationWise',
                                   'Details': 1
                              }
                         }
                    ]
               case "V":
                    return [
                         {
                              "D$lookup": {
                                   "from": "acc_trans_" + request.FinanceYear,
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
                                                                 'D$gte': [
                                                                      '$vDT', request.startdate
                                                                 ]
                                                            }, {
                                                                 'D$lte': [
                                                                      '$vDT', request.enddate
                                                                 ]
                                                            },
                                                            {
                                                                 'D$eq': [
                                                                      '$pARTYTY', 'Vendor'
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
                              'D$group': {
                                   '_id': {
                                        'MainCategory': '$mRPNM',
                                        'PartyDetails': {
                                             'D$concat': [
                                                  {
                                                       'D$toString': '$transactions.pARTYCD'
                                                  }, ':', {
                                                       'D$toString': '$transactions.pARTYNM'
                                                  }
                                             ]
                                        },
                                        'GroupCode': '$gRPCD',
                                        'GroupName': '$gRPNM',
                                        'AccountCode': '$aCCD',
                                        'AccountName': '$aCNM'
                                   },
                                   'TotalCredit': {
                                        'D$sum': '$transactions.cR'
                                   },
                                   'TotalDebit': {
                                        'D$sum': '$transactions.dR'
                                   }
                              }
                         }, {
                              'D$group': {
                                   '_id': {
                                        'PartyDetails': '$_id.PartyDetails',
                                        'MainCategory': '$_id.MainCategory',
                                        'GroupCode': '$_id.GroupCode',
                                        'GroupName': '$_id.GroupName'
                                   },
                                   'TotalCredit': {
                                        'D$sum': '$TotalCredit'
                                   },
                                   'TotalDebit': {
                                        'D$sum': '$TotalDebit'
                                   },
                                   'AccountDetails': {
                                        'D$push': {
                                             'AccountCode': '$_id.AccountCode',
                                             'AccountName': '$_id.AccountName',
                                             'Credit': '$TotalCredit',
                                             'Debit': '$TotalDebit'
                                        }
                                   }
                              }
                         }, {
                              'D$group': {
                                   '_id': {
                                        'PartyDetails': '$_id.PartyDetails',
                                        'MainCategory': '$_id.MainCategory'
                                   },
                                   'Details': {
                                        'D$push': {
                                             'GroupCode': '$_id.GroupCode',
                                             'GroupName': '$_id.GroupName',
                                             'TotalCredit': '$TotalCredit',
                                             'TotalDebit': '$TotalDebit',
                                             'AccountDetails': '$AccountDetails'
                                        }
                                   }
                              }
                         }, {
                              'D$project': {
                                   '_id': 0,
                                   'MainCategory': '$_id.MainCategory',
                                   'PartyDetails': '$_id.PartyDetails',
                                   'Details': 1
                              }
                         }
                    ]
               case "C":
                    return [
                         {
                              "D$lookup": {
                                   "from": "acc_trans_" + request.FinanceYear,
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
                                                                 'D$gte': [
                                                                      '$vDT', request.startdate
                                                                 ]
                                                            }, {
                                                                 'D$lte': [
                                                                      '$vDT', request.enddate
                                                                 ]
                                                            },
                                                            {
                                                                 'D$eq': [
                                                                      '$pARTYTY', 'Customer'
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
                              'D$group': {
                                   '_id': {
                                        'MainCategory': '$mRPNM',
                                        'PartyDetails': {
                                             'D$concat': [
                                                  {
                                                       'D$toString': '$transactions.pARTYCD'
                                                  }, ':', {
                                                       'D$toString': '$transactions.pARTYNM'
                                                  }
                                             ]
                                        },
                                        'GroupCode': '$gRPCD',
                                        'GroupName': '$gRPNM',
                                        'AccountCode': '$aCCD',
                                        'AccountName': '$aCNM'
                                   },
                                   'TotalCredit': {
                                        'D$sum': '$transactions.cR'
                                   },
                                   'TotalDebit': {
                                        'D$sum': '$transactions.dR'
                                   }
                              }
                         }, {
                              'D$group': {
                                   '_id': {
                                        'PartyDetails': '$_id.PartyDetails',
                                        'MainCategory': '$_id.MainCategory',
                                        'GroupCode': '$_id.GroupCode',
                                        'GroupName': '$_id.GroupName'
                                   },
                                   'TotalCredit': {
                                        'D$sum': '$TotalCredit'
                                   },
                                   'TotalDebit': {
                                        'D$sum': '$TotalDebit'
                                   },
                                   'AccountDetails': {
                                        'D$push': {
                                             'AccountCode': '$_id.AccountCode',
                                             'AccountName': '$_id.AccountName',
                                             'Credit': '$TotalCredit',
                                             'Debit': '$TotalDebit'
                                        }
                                   }
                              }
                         }, {
                              'D$group': {
                                   '_id': {
                                        'PartyDetails': '$_id.PartyDetails',
                                        'MainCategory': '$_id.MainCategory'
                                   },
                                   'Details': {
                                        'D$push': {
                                             'GroupCode': '$_id.GroupCode',
                                             'GroupName': '$_id.GroupName',
                                             'TotalCredit': '$TotalCredit',
                                             'TotalDebit': '$TotalDebit',
                                             'AccountDetails': '$AccountDetails'
                                        }
                                   }
                              }
                         }, {
                              'D$project': {
                                   '_id': 0,
                                   'MainCategory': '$_id.MainCategory',
                                   'PartyDetails': '$_id.PartyDetails',
                                   'Details': 1
                              }
                         }
                    ]
               case "E":
                    return [
                         {
                              "D$lookup": {
                                   "from": "acc_trans_" + request.FinanceYear,
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
                                                                 'D$gte': [
                                                                      '$vDT', request.startdate
                                                                 ]
                                                            }, {
                                                                 'D$lte': [
                                                                      '$vDT', request.enddate
                                                                 ]
                                                            },

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
                              'D$group': {
                                   '_id': {
                                        'MainCategory': '$mRPNM',
                                        'EmployeeWise': '$transactions.eNTBY',
                                        'GroupCode': '$gRPCD',
                                        'GroupName': '$gRPNM',
                                        'AccountCode': '$aCCD',
                                        'AccountName': '$aCNM'
                                   },
                                   'TotalCredit': {
                                        'D$sum': '$transactions.cR'
                                   },
                                   'TotalDebit': {
                                        'D$sum': '$transactions.dR'
                                   }
                              }
                         }, {
                              'D$group': {
                                   '_id': {
                                        'EmployeeWise': '$_id.EmployeeWise',
                                        'MainCategory': '$_id.MainCategory',
                                        'GroupCode': '$_id.GroupCode',
                                        'GroupName': '$_id.GroupName'
                                   },
                                   'TotalCredit': {
                                        'D$sum': '$TotalCredit'
                                   },
                                   'TotalDebit': {
                                        'D$sum': '$TotalDebit'
                                   },
                                   'AccountDetails': {
                                        'D$push': {
                                             'AccountCode': '$_id.AccountCode',
                                             'AccountName': '$_id.AccountName',
                                             'Credit': '$TotalCredit',
                                             'Debit': '$TotalDebit'
                                        }
                                   }
                              }
                         }, {
                              'D$group': {
                                   '_id': {
                                        'EmployeeWise': '$_id.EmployeeWise',
                                        'MainCategory': '$_id.MainCategory'
                                   },
                                   'Details': {
                                        'D$push': {
                                             'GroupCode': '$_id.GroupCode',
                                             'GroupName': '$_id.GroupName',
                                             'TotalCredit': '$TotalCredit',
                                             'TotalDebit': '$TotalDebit',
                                             'AccountDetails': '$AccountDetails'
                                        }
                                   }
                              }
                         }, {
                              'D$project': {
                                   '_id': 0,
                                   'MainCategory': '$_id.MainCategory',
                                   'EmployeeWise': '$_id.EmployeeWise',
                                   'Details': 1
                              }
                         }
                    ]
          }

     }

     setDataForTrialBalance(key, data: any) {
          this.storage.setItem(key, JSON.stringify(data));
     }

     getDataForTrialBalance(key) {
          return this.storage.getItem(key);
     }
     async GetTrialBalanceDetailsStatement(request, matchFilter) {

          const reqBody = {
               companyCode: this.storage.companyCode,
               collectionName: "acc_trans_" + request.FinanceYear,
               filters: [matchFilter
                    , {
                         'D$project': {
                              '_id': 0,
                              'vDT': 1,
                              'tTYPNM': 1,
                              'vNO': 1,
                              'pARTYNM': 1,
                              'pARTYCD': 1,
                              'aCCCD': 1,
                              'aCCNM': 1,
                              'cR': 1,
                              'dR': 1,
                              'nRT': 1,
                              'lOC': 1
                         }
                    }
               ]
          };
          try {
               const res = await firstValueFrom(this.masterService.masterMongoPost("generic/query", reqBody));
               if (res.data && res.data.length > 0) {
                    let OthersData = res.data;
                    let reportData = OthersData.sort((a, b) => {
                         if (a.vDT < b.vDT) return 1;
                         if (a.vDT > b.vDT) return -1;
                         return 0;
                    });

                    const modifiedReportData = reportData.map((item, index) => {
                         item['VoucherNo'] = item.vNO;
                         item["VoucherDate"] = item.vDT ? moment(item.vDT).format('DD MMM YYYY') : "";
                         item['Branch'] = item.lOC;
                         item['TransactionType'] = item.tTYPNM;
                         item['PartyCode'] = item.pARTYCD;
                         item['PartyName'] = `${item.pARTYCD}:${item.pARTYNM}` || item.pARTYNM;
                         item['CreditAmount'] = (item.cR).toFixed(2);
                         item['DebitAmount'] = (item.dR).toFixed(2);
                         item['AccountCode'] = item.aCCCD;
                         item['AccountName'] = `${item.aCCCD}:${item.aCCNM}`;
                         item['Narration'] = item.nRT;

                         return item; // Return the modified item
                    });


                    return modifiedReportData
               }
               return []
          } catch (error) {
               console.error("Error:", error);
               throw error;
          }
     }
     async GetOpeningBalance(request, matchFilter) {

          const reqBody = {
               companyCode: this.storage.companyCode,
               collectionName: "acc_opening_" + request.FinanceYear,
               filters: [matchFilter
                    , {
                         'D$project': {
                              '_id': 0,
                              'AccountCode': '$aCCD',
                              'AccountName': '$aCNM',
                              'BranchName': '$bRCD',
                              'CreditAmount': '$cAMT',
                              'DebitAmount': '$dAMT'
                         }
                    }
               ]
          };
          try {
               const res = await firstValueFrom(this.masterService.masterMongoPost("generic/query", reqBody));
               if (res.data && res.data.length > 0) {
                    return res.data
               }
               return []
          } catch (error) {
               console.error("Error:", error);
               throw error;
          }
     }
     async GetBalanceSheet(request) {

          const reqBody = {
               companyCode: this.storage.companyCode,
               collectionName: "account_detail",
               filters: [
                    {
                         'D$match': {
                              'mATCD': {
                                   'D$in': [
                                        'MCT-0001', 'MCT-0004'
                                   ]
                              }
                         }
                    },
                    {
                         "D$lookup": {
                              "from": "acc_trans_" + request.FinanceYear,
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
                                                            'D$gte': [
                                                                 '$' + request.DateType, request.startdate
                                                            ]
                                                       }, {
                                                            'D$lte': [
                                                                 '$' + request.DateType, request.enddate
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
                         'D$group': {
                              '_id': {
                                   'MainCategory': '$mRPNM',
                                   'GroupName': '$gRPNM',
                                   'GroupCode': '$gRPCD',
                                   'BalanceCategoryCode': '$bCATCD',
                                   'BalanceCategoryName': '$bCATNM',
                                   'BSSchedule': '$bSSCH',
                                   'AccountCode': '$aCCD',
                                   'AccountName': '$aCNM'
                              },
                              'TotalCredit': {
                                   'D$sum': '$transactions.cR'
                              },
                              'TotalDebit': {
                                   'D$sum': '$transactions.dR'
                              }
                         }
                    }, {
                         'D$group': {
                              '_id': {
                                   'MainCategory': '$_id.MainCategory',
                                   'GroupName': '$_id.GroupName',
                                   'GroupCode': '$_id.GroupCode',
                                   'BalanceCategoryCode': '$_id.BalanceCategoryCode',
                                   'BalanceCategoryName': '$_id.BalanceCategoryName',
                                   'BSSchedule': '$_id.BSSchedule'
                              },
                              'TotalCredit': {
                                   'D$sum': '$TotalCredit'
                              },
                              'TotalDebit': {
                                   'D$sum': '$TotalDebit'
                              },
                              'AccountDetails': {
                                   'D$push': {
                                        'AccountCode': '$_id.AccountCode',
                                        'AccountName': '$_id.AccountName',
                                        'Credit': '$TotalCredit',
                                        'Debit': '$TotalDebit'
                                   }
                              }
                         }
                    }, {
                         'D$group': {
                              '_id': '$_id.MainCategory',
                              'Details': {
                                   'D$push': {
                                        'GroupName': '$_id.GroupName',
                                        'GroupCode': '$_id.GroupCode',
                                        'BalanceCategoryCode': '$_id.BalanceCategoryCode',
                                        'BalanceCategoryName': '$_id.BalanceCategoryName',
                                        'BSSchedule': '$_id.BSSchedule',
                                        'TotalCredit': '$TotalCredit',
                                        'TotalDebit': '$TotalDebit',
                                        'AccountDetails': '$AccountDetails'
                                   }
                              }
                         }
                    }, {
                         'D$project': {
                              '_id': 0,
                              'MainCategory': '$_id',
                              'Details': 1
                         }
                    }
               ]
          };
          try {
               const res = await firstValueFrom(this.masterService.masterMongoPost("generic/query", reqBody));
               if (res.data && res.data.length > 0) {

                    res.data.sort((a, b) => {
                         const scheduleA = a.Details[0].BSSchedule;
                         const scheduleB = b.Details[0].BSSchedule;

                         if (scheduleA < scheduleB) {
                              return -1;
                         }
                         if (scheduleA > scheduleB) {
                              return 1;
                         }
                         return 0;
                    });
                    const TotalAmountLastFinYear = 0.00; // Assuming this value is available

                    const NewTableList = res.data.flatMap((entry, index) => {

                         // Calculate total amounts for the main category
                         const totalAmountCurrentFinYear = entry.Details.reduce((total, detail) => {
                              return total + (detail.TotalCredit - detail.TotalDebit);
                         }, 0);

                         // Generate rows
                         const mainRow = {
                              MainCategory: entry.MainCategory,
                              SubCategory: 'Total',
                              TotalAmountCurrentFinYear: totalAmountCurrentFinYear.toFixed(2),
                              TotalAmountLastFinYear: TotalAmountLastFinYear.toFixed(2),
                              Notes: '',
                              AccountDetails: ''
                         };

                         const subCategoryRows = entry.Details.map((detail, detailIndex) => ({
                              MainCategory: '',
                              SubCategory: `[${index + 1}.${detailIndex + 1}] ${detail.GroupName}`,
                              TotalAmountCurrentFinYear: (detail.TotalCredit - detail.TotalDebit).toFixed(2),
                              TotalAmountLastFinYear: TotalAmountLastFinYear.toFixed(2),
                              Notes: detail.BSSchedule || '',
                              AccountDetails: detail.AccountDetails
                         }));

                         // Collect unique BalanceCategoryName values
                         const uniqueBalanceCategories = new Set();
                         entry.Details.forEach(detail => uniqueBalanceCategories.add(detail.BalanceCategoryName));

                         // Generate rows for unique BalanceCategoryName values
                         const uniqueCategoryRows = [...uniqueBalanceCategories].map((balanceCategory, detailIndex) => {
                              // Filter details based on current BalanceCategoryName
                              const balanceCategoryDetails = entry.Details.filter(detail => detail.BalanceCategoryName === balanceCategory);
                              // Calculate total amount for the current BalanceCategoryName
                              const totalAmount = balanceCategoryDetails.reduce((total, detail) => total + (detail.TotalCredit - detail.TotalDebit), 0);

                              return {
                                   MainCategory: '',
                                   SubCategory: `[${index + 1}] ${balanceCategory}`,
                                   TotalAmountCurrentFinYear: totalAmount.toFixed(2),
                                   TotalAmountLastFinYear: TotalAmountLastFinYear.toFixed(2),
                                   Notes: '',
                                   AccountDetails: []
                              };
                         });

                         return [mainRow, ...subCategoryRows];
                    });
                    return NewTableList;
               }
               return []
          } catch (error) {
               console.error("Error:", error);
               throw error;
          }
     }
     async GetTemplateForReports(filter = {}) {
          try {
               const req = {
                    companyCode: this.storage.companyCode,
                    filter: filter,
                    collectionName: "viewprint_template",
               };

               // Fetch data from the 'docket' collection using the masterService
               const res = await firstValueFrom(this.masterService.masterMongoPost('generic/get', req));

               if (res.data && res.data.length > 0) {
                    return res.data[0];
               }
               return null

          } catch (error) {
               // Display error message
               console.error("Error:", error);
               throw error;
          }
     }
}