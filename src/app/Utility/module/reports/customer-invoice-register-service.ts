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

  async getcustInvRegReportDetail(data) {
    let matchQuery = {
      D$and: [
        { bGNDT: { D$gte: data.startValue } }, // Convert start date to ISO format
        { bGNDT: { D$lte: data.endValue } }, // Bill date less than or equal to end date
        {
          D$or: [{ cNL: false }, { cNL: { D$exists: false } }],
        },
        ...(data.docNo != "" ? [{ bILLNO: { D$eq: data.docNo } }] : []),
        ...(data.state && data.state.length > 0
          ? [{ D$expr: { D$in: ["$gEN.sT", data.state] } }]
          : []),
        ...(data.status && data.status != ""
          ? [{ bSTS: { D$eq: data.status } }]
          : []),
        ...(data.cust && data.cust.length > 0
          ? [{ D$expr: { D$eq: ["$cUST.nM", data.cust] } }]
          : []),
        ...(data.sac && data.sac.length > 0
          ? [{ D$expr: { D$in: ["$voucher_trans_details.sCOD", data.sac] } }]
          : []),
        ...[{ bLOC: { D$in: data.branch } }],
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
          D$lookup: {
            from: "cd_note_header",
            localField: "bILLNO",
            foreignField: "docNo",
            as: "cd_note_header",
          },
        },
        {
          D$unwind: {
            path: "$cd_note_header",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          D$lookup: {
            from: "cd_note_details",
            localField: "bILLNO",
            foreignField: "docNo",
            as: "cd_note_details",
          },
        },
        {
          D$unwind: {
            path: "$cd_note_details",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          D$lookup: {
            from: "dockets",
            localField: "cust_bill_details.dKTNO",
            foreignField: "dKTNO",
            as: "dockets",
          },
        },
        {
          D$unwind: {
            path: "$dockets",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          D$project: {
            bILLNO: {
              D$ifNull: ["$bILLNO", ""],
            },
            bGNDT: {
              D$dateToString: {
                format: "%Y-%m-%d %H:%M",
                date: {
                  D$add: [{ D$toDate: "$bGNDT" }, 86400000],
                },
              },
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
            bLOC: {
              D$ifNull: ["$bLOC", ""],
            },
            gSTIN: {
              D$ifNull: ["$gEN.gSTIN", ""],
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
            gROSSAMT: {
              D$ifNull: ["$gST.gROSSAMT", ""],
            },
            aMT: {
              D$ifNull: ["$gST.iGST", ""],
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
            dKTTOT: {
              D$ifNull: ["$dKTTOT", ""],
            },
            cAMT: {
              D$ifNull: ["$cOL.cAMT", ""],
            },
            bALAMT: {
              D$ifNull: ["$cOL.bALAMT", ""],
            },
            cRAMT: {
              D$ifNull: ["$cd_note_header.aMT", ""],
            },
            tDSAMT: {
              D$ifNull: ["$voucher_trans.tDSAMT", ""],
            },
            tDSNM: {
              D$ifNull: ["$voucher_trans.tDSNM", ""],
            },
            sT: {
              D$ifNull: ["$gEN.sT", ""],
            },
            gEXMT: {
              D$ifNull: ["$eXMT", ""],
            },
            pAYBAS: {
              D$ifNull: ["$pAYBAS", ""],
            },
            mRNO: {
              D$ifNull: ["$cust_bill_collection.mRNO", ""],
            },
            dTM: {
              D$dateToString: {
                format: "%Y-%m-%d %H:%M",
                date: {
                  D$add: [{ D$toDate: "$dTM" }, 86400000],
                },
              },
            },
            nTNO: {
              D$ifNull: ["$cd_note_header.nTNO", ""],
            },
            nTDT: {
              D$dateToString: {
                format: "%Y-%m-%d %H:%M",
                date: {
                  D$add: [{ D$toDate: "$cust_bill_collection.nTDT" }, 86400000],
                },
              },
            },
            gTEXMT: {
              D$ifNull: ["$gEN.eXMT", ""],
            },
            geNTBY: {
              D$ifNull: ["$eNTBY", ""],
            },
            eNTDT: {
              D$dateToString: {
                format: "%Y-%m-%d %H:%M",
                date: {
                  D$add: [{ D$toDate: "$cust_bill_collection.eNTDT" }, 86400000],
                },
              },
            },
            tO: {
              D$ifNull: ["$sUB.tO", ""],
            },
            sDTM: {
              D$dateToString: {
                format: "%Y-%m-%d %H:%M",
                date: {
                  D$add: [{ D$toDate: "$sUB.dTM" }, 86400000],
                },
              },
            },
            aBY: {
              D$ifNull: ["$aPR.aBY", ""],
            },
            aDT: {
              D$dateToString: {
                format: "%Y-%m-%d %H:%M",
                date: {
                  D$add: [{ D$toDate: "$aPR.aDT" }, 86400000],
                },
              },
            },
            cBY: {
              D$ifNull: ["$cust_bill_collection.eNTBY", ""],
            },
            cDT: {
              D$dateToString: {
                format: "%Y-%m-%d %H:%M",
                date: {
                  D$add: [{ D$toDate: "$cust_bill_collection.eNTDT" }, 86400000],
                },
              },
            },
            cNBY: {
              D$ifNull: ["$cd_note_header.eNTBY", ""],
            },
            cNDT: {
              D$dateToString: {
                format: "%Y-%m-%d %H:%M",
                date: {
                  D$add: [{ D$toDate: "$cd_note_header.eNTDT" }, 86400000],
                },
              },
            },
            eNTBY: {
              D$ifNull: ["$eNTBY", ""],
            },
          },
        },
      ],
    };
    const res = await firstValueFrom(
      this.masterServices.masterMongoPost("generic/query", reqBody)
    );
    const details = res.data.map((item) => ({
      ...item,
      partyType: item.eXMT ? "Registered" : "UnRegistered",
    }));

    return details;
  }
}
