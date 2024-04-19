import { Injectable } from "@angular/core";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";
import { GenericActions, StoreKeys } from "src/app/config/myconstants";
import { Observable, catchError, concatMap, firstValueFrom, forkJoin, mergeMap, throwError, timer } from "rxjs";
import { ConvertToNumber } from "src/app/Utility/commonFunction/common";
import { chunkArray } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { debug } from "console";
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import { VoucherDataRequestModel, VoucherInstanceType, VoucherRequestModel, VoucherType, ledgerInfo } from "src/app/Models/Finance/Finance";
import { financialYear } from "src/app/Utility/date/date-utils";
import Swal from "sweetalert2";
import { VoucherServicesService } from "src/app/core/service/Finance/voucher-services.service";

@Injectable({
    providedIn: "root",
})
export class ThcCostUpdateService {
    VoucherRequestModel = new VoucherRequestModel();
    VoucherDataRequestModel = new VoucherDataRequestModel();
    constructor(
        private operationService: OperationService,
        private storage: StorageService,
        private voucherServicesService: VoucherServicesService
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
                    [request.thc.docNoField]: { "D$in": Array.isArray(request.thcNo) ? request.thcNo : [request.thcNo] },
                    "cNL": { "D$in": [false, null] }
                }
            },
            {
                "D$lookup": {
                    "from": request.mfheader.collation,
                    "let": { "docNo": `$${request.thc.docNoField}` },
                    "pipeline": [
                        {
                            "D$match": {
                                "D$expr": {
                                    "D$and": [
                                        { "D$eq": ["$cID", this.storage.companyCode] },
                                        { "D$eq": [`$${request.mfheader.thcField}`, "$$docNo"] }
                                    ]
                                }
                            }
                        },
                        {
                            "D$lookup": {
                                "from": request.mfdetails.collation,
                                "let": { "mFNO": `$${request.mfheader.docNoField}` },
                                "pipeline": [
                                    {
                                        "D$match": {
                                            "D$expr": {
                                                "D$and": [
                                                    { "D$eq": ["$cID", this.storage.companyCode] },
                                                    { "D$eq": [`$${request.mfdetails.docNoField}`, "$$mFNO"] }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        "D$lookup": {
                                            "from": request.docket.collation,
                                            "let": { "dKTNO": `$${request.mfdetails.dktField}` },
                                            "pipeline": [
                                                {
                                                    "D$match": {
                                                        "D$expr": {
                                                            "D$and": [
                                                                { "D$eq": ["$cID", this.storage.companyCode] },
                                                                { "D$eq": [`$${request.docket.docNoField}`, "$$dKTNO"] }
                                                            ]
                                                        }
                                                    }
                                                }
                                            ],
                                            "as": "docket"
                                        }
                                    },
                                    { "D$unwind": "$docket" }
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
            if (request.isInterBranchControl) {
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

                const ChargeCost = Object.entries(sumByOrigin).map(([OriginBranch, value]: [string, any]) => ({
                    OriginBranch,
                    ChargeCost: value.cHGCOST
                }));

                this.AccountPosting(thcs[0], ChargeCost);
            }
        });
    }
    async AccountPosting(THCInfo, ChargeCost: any[]) {
        try {
            const Response = [];

            for (let i = 0; i < ChargeCost.length; i++) {
                const data = ChargeCost[i];
                const result = await firstValueFrom(this.createJournalRequest(THCInfo, data));

                const ResultObject = {
                    THCNo: result.data.ops[0].docNo,
                    VoucherNo: result.data.ops[0].vNO
                };

                Response.push(ResultObject);
            }

            return Response;
        } catch (error) {
            console.log(error);
            throw error; // Rethrow the error to handle it elsewhere if needed
        }
    }


    createJournalRequest(THCInfo, RequestData: any): Observable<any> {
        const voucherRequest = {
            companyCode: this.storage.companyCode,
            docType: "VR",
            branch: RequestData.OriginBranch,
            finYear: financialYear,
            details: [],
            debitAgainstDocumentList: [],
            data: {
                transCode: VoucherInstanceType.THCArrival,
                transType: VoucherInstanceType[VoucherInstanceType.THCArrival],
                voucherCode: VoucherType.JournalVoucher,
                voucherType: VoucherType[VoucherType.JournalVoucher],
                transDate: new Date(),
                docType: "VR",
                branch: this.storage.branch,
                finYear: financialYear,
                accLocation: THCInfo.lOC,
                preperedFor: "Vendor",
                partyCode: THCInfo.vND.cD,
                partyName: THCInfo.vND.nM,
                partyState: "",
                entryBy: this.storage.userName,
                entryDate: new Date(),
                panNo: "",
                tdsSectionCode: undefined,
                tdsSectionName: undefined,
                tdsRate: 0,
                tdsAmount: 0,
                tdsAtlineitem: false,
                tcsSectionCode: undefined,
                tcsSectionName: undefined,
                tcsRate: 0,
                tcsAmount: 0,
                IGST: 0,
                SGST: 0,
                CGST: 0,
                UGST: 0,
                GSTTotal: 0,
                GrossAmount: RequestData.ChargeCost,
                netPayable: RequestData.ChargeCost,
                roundOff: 0,
                voucherCanceled: false,
                paymentMode: "",
                refNo: "",
                accountName: "",
                accountCode: "",
                date: "",
                scanSupportingDocument: "",
                transactionNumber: THCInfo.tHC,
            }
        };

        // Retrieve voucher line items
        const voucherlineItems = this.GetJournalVoucherLedgers(RequestData.ChargeCost, THCInfo.tHC);
        voucherRequest.details = voucherlineItems;

        // Create and return an observable representing the HTTP request
        return this.voucherServicesService.FinancePost("fin/account/voucherentry", voucherRequest).pipe(
            catchError((error) => {
                // Handle the error here
                console.error('Error occurred while creating voucher:', error);
                // Return a new observable with the error
                return throwError(error);
            }),
            mergeMap((res: any) => {
                let reqBody = {
                    companyCode: this.storage.companyCode,
                    voucherNo: res?.data?.mainData?.ops[0].vNO,
                    transDate: Date(),
                    finYear: financialYear,
                    branch: this.storage.branch,
                    transCode: VoucherInstanceType.THCArrival,
                    transType: VoucherInstanceType[VoucherInstanceType.THCArrival],
                    voucherCode: VoucherType.JournalVoucher,
                    voucherType: VoucherType[VoucherType.JournalVoucher],
                    docType: "Voucher",
                    partyType: "Vendor",
                    docNo: THCInfo.tHC,
                    partyCode: "" + THCInfo.vND.cD || "",
                    partyName: THCInfo.vND.nM || "",
                    entryBy: this.storage.userName,
                    entryDate: Date(),
                    debit: voucherlineItems.filter(item => item.credit == 0).map(function (item) {
                        return {
                            "accCode": item.accCode,
                            "accName": item.accName,
                            "accCategory": item.accCategory,
                            "amount": item.debit,
                            "narration": item.narration ?? ""
                        };
                    }),
                    credit: voucherlineItems.filter(item => item.debit == 0).map(function (item) {
                        return {
                            "accCode": item.accCode,
                            "accName": item.accName,
                            "accCategory": item.accCategory,
                            "amount": item.credit,
                            "narration": item.narration ?? ""
                        };
                    }),
                };

                return this.voucherServicesService.FinancePost("fin/account/posting", reqBody);
            }),
            catchError((error) => {
                // Handle the error here
                console.error('Error occurred while posting voucher:', error);
                // Return a new observable with the error
                return throwError(error);
            })
        );
    }

    GetJournalVoucherLedgers(ChargeCost, THCNo) {

        const createVoucher = (accCode, accName, accCategory, debit, credit, THCNo) => ({
            companyCode: this.storage.companyCode,
            voucherNo: "",
            transCode: VoucherInstanceType.THCArrival,
            transType: VoucherInstanceType[VoucherInstanceType.THCArrival],
            voucherCode: VoucherType.JournalVoucher,
            voucherType: VoucherType[VoucherType.JournalVoucher],
            transDate: new Date(),
            finYear: financialYear,
            branch: this.storage.branch,
            accCode,
            accName,
            accCategory,
            sacCode: "",
            sacName: "",
            debit,
            credit,
            GSTRate: 0,
            GSTAmount: 0,
            Total: debit + credit,
            TDSApplicable: false,
            narration: `when THC No ${THCNo} Is Arrived`
        });
        const Result = [];
        Result.push(createVoucher(ledgerInfo['Inter branch control'].LeadgerCode,
            ledgerInfo['Inter branch control'].LeadgerName, ledgerInfo['Inter branch control'].LeadgerCategory, 0, ChargeCost, THCNo));
        Result.push(createVoucher(ledgerInfo['Transport Expense'].LeadgerCode,
            ledgerInfo['Transport Expense'].LeadgerName, ledgerInfo['Transport Expense'].LeadgerCategory, ChargeCost, 0, THCNo));

        return Result;
    }
}