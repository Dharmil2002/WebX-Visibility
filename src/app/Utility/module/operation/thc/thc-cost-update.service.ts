import { Injectable } from "@angular/core";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";
import { GenericActions } from "src/app/config/myconstants";
import { firstValueFrom } from "rxjs";
import { ConvertToNumber } from "src/app/Utility/commonFunction/common";
import { chunkArray } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { debug } from "console";

@Injectable({
    providedIn: "root",
})
export class ThcCostUpdateService {
    constructor(
        private operationService: OperationService,
        private storage: StorageService
    ) { }

    
    async getTHCDetaisWithDockets(request: any): Promise<any[]> {
        //Request format
        /*
         Request for FTL
         {
            isInterBranchControl: false,
            thcNo: string || string[],
            thc: {
                collation: "thc_summary",
                docNoField: "docNo"
            },
            mfheader: {
                collation: "mf_header",
                docNoField: "docNo",
                thcField: "tHC"
            },
            mfdetails: {
                collation: "mf_details",
                docNoField: "mFNO",
                dktField: "dKTNO"
            },
            docket: {
                collation: "dockets",
                docNoField: "dKTNO"
            }
        }

        Request for LTL
         {
            isInterBranchControl: false,
            thcNo: string || string[],
            thc: {
                collation: "thc_summary_ltl",
                docNoField: "docNo"
            },
            mfheader: {
                collation: "mf_headers_ltl",
                docNoField: "mFNO",
                thcField: "tHC"
            },
            mfdetails: {
                collation: "mf_details_ltl",
                docNoField: "mFNO",
                dktField: "dKTNO"
            },
            docket: {
                collation: "dockets_ltl",
                docNoField: "dKTNO"
            }
        }
        */
        let query = [
            {
                "D$match": {
                    "cID": this.storage.companyCode,
                    [request.thc.docNoField]: {"D$in": Array.isArray(request.thcNo) ? request.thcNo : [request.thcNo]},
                    "cNL": {"D$in": [false, null]}
                }
            },
            {
                "D$lookup": {
                    "from": request.mfheader.collation,
                    "let": {"docNo": `$${request.thc.docNoField}`},
                    "pipeline": [
                        {
                            "D$match": {
                                "D$expr": {
                                    "D$and": [
                                        {"D$eq": ["$cID", this.storage.companyCode]},
                                        {"D$eq": [`$${request.mfheader.thcField}`, "$$docNo"]}
                                    ]
                                }
                            }
                        },
                        {
                            "D$lookup": {
                                "from": request.mfdetails.collation,
                                "let": {"mFNO": `$${request.mfheader.docNoField}`},
                                "pipeline": [
                                    {
                                        "D$match": {
                                            "D$expr": {
                                                "D$and": [
                                                    {"D$eq": ["$cID", this.storage.companyCode]},
                                                    {"D$eq": [`$${request.mfdetails.docNoField}`, "$$mFNO"]}
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        "D$lookup": {
                                            "from": request.docket.collation,
                                            "let": {"dKTNO": `$${request.mfdetails.dktField}`},
                                            "pipeline": [
                                                {
                                                    "D$match": {
                                                        "D$expr": {
                                                            "D$and": [
                                                                {"D$eq": ["$cID", this.storage.companyCode]},
                                                                {"D$eq": [`$${request.docket.docNoField}`, "$$dKTNO"]}
                                                            ]
                                                        }
                                                    }
                                                }
                                            ],
                                            "as": "docket"
                                        }
                                    },
                                    {"D$unwind": "$docket"}
                                ],
                                "as": "mf_dockets"
                            }
                        }
                    ],
                    "as": "mf_header"
                }
            }
        ]

        const req = {
            companyCode: this.storage.companyCode,
            collectionName: request.thc.collation,
            filters: query,
        };

        const res = await firstValueFrom(this.operationService.operationMongoPost(GenericActions.Query, req));
        return res?.data || [];
    }

    async updateTHCCostForDockets(request) {
        var thcs = await this.getTHCDetaisWithDockets(request);
      
        if (thcs.length === 0) {
            return;
        }

        thcs.map(async (thc) => {
            const tripCost = thc.tOTAMT;

            //Need to calculate find total charge weight, currently its done on loaded weight (actual weight) because charge weight is not available
            const totalWT = thc.mf_header.map((x) => x.mf_dockets.map(m => m.lDWT || m.wT)).flat().reduce((acc, curr) => acc + curr, 0);
            const totalCWT = thc.mf_header.map((x) => x.mf_dockets.map(m => m.lDCWT || m.cWT || m.lDWT || m.wT)).flat().reduce((acc, curr) => acc + curr, 0);
            let aCPKG = tripCost / totalWT;
            let cCPKG = tripCost / totalCWT;

            let batchOperations = [];
            thc.mf_header.map((mf) => {
               mf.mf_dockets.map((mfd) => {
                    const aCTCOST = ConvertToNumber((mfd.lDWT || mfd.wT) * aCPKG, 3);
                    const cHGCOST = ConvertToNumber((mfd.lDCWT || mfd.cWT || mfd.lDWT || mfd.wT) * cCPKG, 3);

                    mfd.aCTCOST = aCTCOST;
                    mfd.cHGCOST = cHGCOST;

                    batchOperations.push({
                        filter: { _id: mfd._id },
                        update: {
                            aCTCOST: aCTCOST,
                            cHGCOST: cHGCOST
                        }
                    });                    
                });
            });

            //UpdateBulk
            let chunks = chunkArray(batchOperations, 100);
            await Promise.all(
                chunks.map(async (operations) => {
                    const updateRequest = { 
                        companyCode: this.storage.companyCode,
                        collectionName: request.mfdetails.collation, 
                        data: operations 
                    };
                    return firstValueFrom(this.operationService.operationMongoPut(GenericActions.UpdateBulk, updateRequest));
                })
            );

            //if Inter Branch Control is enabled then need to calculate origin wise cost and do account posting            
            if(request.isInterBranchControl) {
                const originWiseCost = thc.mf_header.map(x => {
                    return x.mf_dockets.map(m => ({
                        oRGN: m.docket.oRGN,
                        aCTCOST: m.aCTCOST || 0,
                        cHGCOST: m.cHGCOST || 0
                    })).flat();
                }).flat();

                const sumByOrigin = originWiseCost.reduce((acc: any, curr: any) => {
                    const { oRGN, aCTCOST, cHGCOST } = curr;
                    if (!acc[oRGN]) {
                        acc[oRGN] = { aCTCOST: 0, cHGCOST: 0 };
                    }
                    acc[oRGN].aCTCOST += (aCTCOST || 0);
                    acc[oRGN].cHGCOST += (cHGCOST || 0);
                    return acc;
                }, {});

                console.log(sumByOrigin);
            }
        });

    }
}