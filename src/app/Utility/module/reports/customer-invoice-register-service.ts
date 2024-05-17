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

  async getcustInvRegReportDetail(startValue, endValue, docNo) {
    let matchQuery = {
      D$and: [
        { bGNDT: { D$gte: startValue } }, // Convert start date to ISO format
        { bGNDT: { D$lte: endValue } }, // Bill date less than or equal to end date
        {
          D$or: [{ cNL: false }, { cNL: { D$exists: false } }],
        },
        ...(docNo != "" ? [{ bILLNO: { 'D$eq': docNo } }] : []),
      ],
    };
    const reqBody = {
      companyCode: this.storage.companyCode,
      collectionName: "cust_bill_headers",
      filters: [
        {
          D$match: matchQuery,
        },
        {
          D$lookup: {
            from: "cust_bill_headers",
            localField: "bILLNO",
            foreignField: "bILLNO",
            as: "cust_bill_headers",
          },
        },
        {
          D$unwind: {
            path: "$cust_bill_headers",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          D$lookup: {
            from: "cust_bill_details",
            localField: "bILLNO",
            foreignField: "bILLNO",
            as: "cust_bill_details",
          },
        },
        {
          D$unwind: {
            path: "$cust_bill_details",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          D$lookup: {
            from: "cust_bill_collection",
            localField: "bILLNO",
            foreignField: "bILLNO",
            as: "cust_bill_collection",
          },
        },
        {
          D$unwind: {
            path: "$cust_bill_collection",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          D$lookup: {
            from: "voucher_trans",
            localField: "cust_bill_collection.vUCHNO",
            foreignField: "vNO",
            as: "voucher_trans",
          },
        },
        {
          D$unwind: {
            path: "$voucher_trans",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          D$lookup: {
            from: "voucher_trans_details",
            localField: "voucher_trans.vNO",
            foreignField: "vNO",
            as: "voucher_trans_details",
          },
        },
        {
          D$unwind: {
            path: "$voucher_trans_details",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          D$project: {
            bILLNO: {
              D$ifNull: ["$bILLNO", ""],
            },
            bGNDT: {
              D$ifNull: ["$bGNDT", ""],
            },
            dOCTYP: {
              D$ifNull: ["$dOCTYP", ""],
            },
            bSTSNM: {
              D$ifNull: ["$bSTSNM", ""],
            },
            nM: {
              D$ifNull: ["$cUST.nM", ""],
            },
            STIN: {
              D$ifNull: ["$cUST.gSTIN", ""],
            },
            gSTIN: {
              D$ifNull: ["$gEN.gSTIN", ""],
            },
            bLOC: {
              D$ifNull: ["$bLOC", ""],
            },
            nRT: {
              D$ifNull: ["$nRT", ""],
            },
            lOC: {
              D$ifNull: ["$sUB.lOC", ""],
            },
            eXMT: {
              D$ifNull: ["$eXMT", ""],
            },
            sCOD: {
              D$ifNull: ["$voucher_trans_details.sCOD", ""],
            },
            rATE: {
              D$ifNull: ["$gST.rATE", ""],
            },
            iGST: {
              D$ifNull: ["$gST.iGST", ""],
            },
            cGST: {
              D$ifNull: ["$gST.cGST", ""],
            },
            sGST: {
              D$ifNull: ["$gST.sGST", ""],
            },
            uTGST: {
              D$ifNull: ["$gST.uTGST", ""],
            },
            mRNO: {
              D$ifNull: ["$cust_bill_collection.mRNO", ""],
            },
            glOC: {
              D$ifNull: ["$gEN.lOC", ""],
            },
            eNTBY: {
              D$ifNull: ["$eNTBY", ""],
            }

          },
        },
      ],
    };
    const res = await firstValueFrom(
      this.masterServices.masterMongoPost("generic/query", reqBody)
    );
    return res.data;
  }
}
