import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
@Injectable({
  providedIn: "root",
})
export class CustInvoiceRegService {
  constructor(
    private masterServices: MasterService,
    private storage: StorageService
  ) {}

  async getcustInvRegReportDetail(startValue,endValue) {
    let matchQuery = {
      'D$and': [
        { bGNDT: { 'D$gte': startValue } }, // Convert start date to ISO format
        { bGNDT: { 'D$lte': endValue } }, // Bill date less than or equal to end date
        {
          'D$or': [{ cNL: false }, { cNL: { D$exists: false } }],
        },
      ],
    };
    const reqBody = {
      companyCode: this.storage.companyCode,
      collectionName: "cust_bill_headers",
      filters:
        [
          {
            D$match: matchQuery,
          },
          {
            $lookup: {
              from: "cust_bill_headers",
              localField: "bILLNO",
              foreignField: "bILLNO",
              as: "cust_bill_headers"
            }
          },
          {
            $unwind: {
              path: "$cust_bill_headers",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: "cust_bill_details",
              localField: "bILLNO",
              foreignField: "bILLNO",
              as: "cust_bill_details"
            }
          },
          {
            $unwind: {
              path: "$cust_bill_details",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: "cust_bill_collection",
              localField: "bILLNO",
              foreignField: "bILLNO",
              as: "cust_bill_collection"
            }
          },
          {
            $unwind: {
              path: "$cust_bill_collection",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: "voucher_trans",
              localField: "cust_bill_collection.vUCHNO",
              foreignField: "vNO",
              as: "voucher_trans"
            }
          },
          {
            $unwind: {
              path: "$voucher_trans",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: "voucher_trans_details",
              localField: "vNO",
              foreignField: "vNO",
              as: "voucher_trans_details"
            }
          },
          {
            $unwind: {
              path: "$voucher_trans_details",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $project: {
            bILLNO: {
                    $ifNull: ["$bILLNO", ""]
                  },
          //     cust_bill_headers: {
          //       $ifNull: ["$cust_bill_headers", ""]
          //     },
          //     cust_bill_details: {
          //       $ifNull: ["$cust_bill_details", ""]
          //     },
          //     cust_bill_collection: {
          //       $ifNull: ["$cust_bill_collection", ""]
          //     },
          //     voucher_trans: {
          //       $ifNull: ["$voucher_trans", ""]
          //     },
          //     voucher_trans_details: {
          //       $ifNull: ["$voucher_trans_details", ""]
          //     },
            }
          }
        ]
    };
    const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/query", reqBody));
    return res.data;
  }
}
