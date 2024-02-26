import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { StorageService } from 'src/app/core/service/storage.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class InvoiceCountService {

  constructor(private operationService: OperationService,
    private storage: StorageService) { }

  //#region to get Pending count list
  async getPengPodCount(filter = {}) {
    try {
      // Prepare the request object
      const req = {
        companyCode: localStorage.getItem("companyCode"),
        filter: filter,
        collectionName: "docket_ops_det",
      };

      // Fetch data from the 'docket' collection using the masterService
      const res = await firstValueFrom(this.operationService.operationPost('generic/get', req));

      return res.data;

    } catch (error) {
      // Display error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error,
        showConfirmButton: true,
      });
    }
  }
  //#endregion

  //#region to get docket list
  async getDashboardData() {
    try {
      const req = {
        companyCode: this.storage.companyCode,
        collectionName: "docket_fin_det",
        filters: [
          {
            D$facet: {
              docket_fin_det_facet: [
                { D$match: { isBILLED: false, bLOC: this.storage.branch } },
                {
                  D$lookup: {
                    from: "dockets",
                    let: { cID: "$cID" },
                    pipeline: [
                      {
                        D$match: {
                          D$expr: {
                            D$and: [
                              { D$eq: ["$cID", "$$cID"] },
                              { D$eq: ["$fSTS", 1] },
                              { D$eq: ["$oRGN", this.storage.branch] },
                            ],
                          },
                        },
                      },
                    ],
                    as: "financialDetails",
                  },
                },
                {
                  D$lookup: {
                    from: "cust_bill_headers",
                    let: { cID: "$cID" },
                    pipeline: [
                      {
                        D$match: {
                          D$expr: {
                            D$and: [
                              { D$eq: ["$cID", "$$cID"] },
                              { D$eq: ["$bSTS", 1] },
                              { D$eq: ["$bLOC", this.storage.branch] },
                            ],
                          },
                        },
                      },
                    ],
                    as: "cust_bill_headers",
                  },
                },
                {
                  D$group: {
                    _id: null,
                    Unbilled_aMT: { D$sum: "$tOTAMT" },
                    Unbilledcount: {
                      D$sum: {
                        D$cond: {
                          if: { D$eq: ['$sTS', 0] },
                          then: 1,
                          else: 0,
                        },
                      },
                    },
                    approvedBillCount: {
                      D$sum: {
                        D$cond: {
                          if: { D$eq: ['$sTS', 1] },
                          then: 1,
                          else: 0,
                        },
                      },

                      // D$first: { D$size: "$financialDetails" }
                    },
                    cust_bill_headers: {
                      D$addToSet: {
                        count: { D$size: "$cust_bill_headers" },
                        total: { D$sum: "$cust_bill_headers.aMT" },
                      },
                    },
                  },
                },
              ],
            },
          },
          {
            D$project: {
              dashboardCounts: {
                D$mergeObjects: {
                  D$arrayElemAt: ["$docket_fin_det_facet", 0],
                },
              },
            },
          },
        ]
      };

      const res = await firstValueFrom(this.operationService.operationPost('generic/query', req));
      // console.log(res.data);
      return res.data;
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
  //#endregion
}