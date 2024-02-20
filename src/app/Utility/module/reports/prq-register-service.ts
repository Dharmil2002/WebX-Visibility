import { Injectable } from "@angular/core";
import moment from "moment";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import * as XLSX from 'xlsx';

@Injectable({
    providedIn: "root",
})

export class prqreportService {
    constructor(
        private masterServices: MasterService,
        private storage: StorageService
    ) { }

    async getprqReportDetail(start, end, billparty, prqArray) {
        // Extract bill party from the request object
        const billParty = billparty ? billparty.map(x => x.BPartyCD) || [] : [];

        let matchQuery = {
            'D$and': [
                { pICKDT: { 'D$gte': start } }, // Convert start date to ISO format
                { pICKDT: { 'D$lte': end } }, // prq date less than or equal to end date
                {
                    'D$or': [{ cNL: false }, { cNL: { D$exists: false } }],
                },
                ...(billParty.length > 0 ? [{ bPARTY: { 'D$in': billParty } }] : []), // Billing Party condition
                ...(prqArray.length > 0 ? [{ pRQNO: { 'D$in': prqArray } }] : []), // PRQNo condition
            ]
        };
        const reqBody = {
            companyCode: this.storage.companyCode,
            collectionName: "prq_summary",
            filters: [
                {
                    D$match: matchQuery,
                },
                {
                    "D$lookup": {
                        "from": "dockets",
                        "let": { "pRQNO": "$pRQNO" },
                        "pipeline": [
                            {
                                "D$match": {
                                    "D$and": [
                                        { "D$expr": { "D$eq": ["$pRQNO", "$$pRQNO"] } },
                                        { "cNL": { "D$in": [false, null] } }
                                    ]
                                }
                            }
                        ],
                        "as": "dockets"
                    }
                },
                {
                    "D$unwind": { "path": "$dockets", "preserveNullAndEmptyArrays": true }
                },
                {
                    "D$lookup": {
                        "from": "mf_details",
                        "let": { "dKTNO": "$dockets.dKTNO" },
                        "pipeline": [
                            {
                                "D$match": {
                                    "D$and": [
                                        { "D$expr": { "D$eq": ["$dKTNO", "$$dKTNO"] } },
                                        { "cNL": { "D$in": [false, null] } }
                                    ]
                                }
                            }
                        ],
                        "as": "md"
                    }
                },
                {
                    "D$unwind": { "path": "$md", "preserveNullAndEmptyArrays": true }
                },
                {
                    "D$lookup": {
                        "from": "mf_header",
                        "let": { "mFNO": "$md.mFNO" },
                        "pipeline": [
                            {
                                "D$match": {
                                    "D$and": [
                                        { "D$expr": { "D$eq": ["$docNo", "$$mFNO"] } },
                                        { "cNL": { "D$in": [false, null] } }
                                    ]
                                }
                            }
                        ],
                        "as": "mf"
                    }
                },
                {
                    "D$unwind": { "path": "$mf", "preserveNullAndEmptyArrays": true }
                },
                {
                    "D$lookup": {
                        "from": "thc_summary",
                        "let": { "tHC": "$mf.tHC" },
                        "pipeline": [
                            {
                                "D$match": {
                                    "D$and": [
                                        { "D$expr": { "D$eq": ["$docNo", "$$tHC"] } },
                                        { "cNL": { "D$in": [false, null] } }
                                    ]
                                }
                            }
                        ],
                        "as": "trips"
                    }
                },
                {
                    "D$unwind": { "path": "$dockets", "preserveNullAndEmptyArrays": true }
                },
                {
                    "D$unwind": { "path": "$md", "preserveNullAndEmptyArrays": true }
                },
                {
                    "D$unwind": { "path": "$mf", "preserveNullAndEmptyArrays": true }
                },
                {
                    "D$unwind": { "path": "$trips", "preserveNullAndEmptyArrays": true }
                },
                {
                    "D$project": {
                        "prqNo": { "D$ifNull": ["$pRQNO", ""] },
                        "prqDt": { "D$ifNull": ["$pICKDT", ""] },
                        "PickDtTime": { "D$ifNull": ["$pICKDT", ""] },
                        "prqStatus": { "D$ifNull": ["$sTSNM", ""] },
                        "BillParty": { "D$concat": [{ "D$ifNull": ["$bPARTY", ""] }, " - ", { "D$ifNull": ["$bPARTYNM", ""] }] },
                        "from": { "D$ifNull": ["$fCITY", ""] },
                        "to": { "D$ifNull": ["$tCITY", ""] },
                        "carrierType": { "D$ifNull": ["$cARTYPNM", ""] },
                        "Cap": { "D$ifNull": ["$sIZE", ""] },
                        "PayMode": { "D$ifNull": ["$pAYTYPNM", ""] },
                        "PRQRaiseBranch": { "D$ifNull": ["$bRCD", ""] },
                        "ContractAmt": { "D$ifNull": ["$cONTRAMT", ""] },
                        "VehNo": { "D$ifNull": ["$vEHNO", ""] },
                        "VenType": { "D$ifNull": ["$dockets.vENDTYNM", ""] },
                        // "VenNmCd": { "D$concat": [{ "D$ifNull": ["$dockets.vNDCD", ""] }, " - ", { "D$ifNull": ["$dockets.vNDNM", ""] }] },
                        "VenCD": { "D$ifNull": ["$dockets.vNDCD", ""] },
                        "VenNm": { "D$ifNull": ["$dockets.vNDNM", ""] },
                        "ConsigNoteNo": { "D$ifNull": ["$dockets.dKTNO", ""] },
                        "ConsigNoteDt": { "D$ifNull": ["$dockets.dKTDT", ""] },
                        "ConsigNoteTotAmt": { "D$ifNull": ["$dockets.tOTAMT", ""] },
                        "THCNo": { "D$ifNull": ["$trips.docNo", ""] },
                        "THCDt": { "D$ifNull": ["$trips.tHCDT", ""] },
                        "THCAmt": { "D$ifNull": ["$trips.cONTAMT", ""] }
                    }
                }
            ]
        };

        const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/query", reqBody));
        // Format the date using moment
        res.data.forEach(item => {
            item.prqDt = item.prqDt ? moment(item.prqDt).format('YYYY-MM-DD') : "";
            item.PickDtTime = item.PickDtTime ? moment(item.PickDtTime).format('YYYY-MM-DD') : "";
            item.ConsigNoteDt = item.ConsigNoteDt ? moment(item.ConsigNoteDt).format('YYYY-MM-DD') : "";
            item.THCDt = item.THCDt ? moment(item.THCDt).format('YYYY-MM-DD') : "";
        });
        return res.data;
    }
}

export function exportAsExcelFile(json: any[], excelFileName: string, customHeaders: Record<string, string>): void {
    // Remove the _id field from each row in the JSON data
    const cleanedJson = json.map(row => {
        delete row._id;
        return row;
    });
    // Convert the JSON data to an Excel worksheet using XLSX.utils.json_to_sheet.
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(cleanedJson);
    // Get the keys (headers) from the first row of the JSON data.
    const headerKeys = Object.keys(cleanedJson[0]);
    // Iterate through the header keys and replace the default headers with custom headers.
    for (let i = 0; i < headerKeys.length; i++) {
        const headerKey = headerKeys[i];
        if (headerKey && customHeaders[headerKey]) {
            worksheet[XLSX.utils.encode_col(i) + '1'] = { t: 's', v: customHeaders[headerKey] };
        }
    }
    // Format the headers in the worksheet.
    for (const key in worksheet) {
        if (Object.prototype.hasOwnProperty.call(worksheet, key)) {
            // Check if the key corresponds to a header cell (e.g., A1, B1, etc.).
            const reg = /^[A-Z]+1$/;
            if (reg.test(key)) {
                // Set the format of the header cells to '0.00'.
                worksheet[key].z = '0.00';
            }
        }
    }
    // Create a workbook containing the worksheet.
    const workbook: XLSX.WorkBook = { Sheets: { 'Vendor_Wise_Outstanding_Report': worksheet }, SheetNames: ['Vendor_Wise_Outstanding_Report'] };
    // Write the workbook to an Excel file with the specified filename.
    XLSX.writeFile(workbook, `${excelFileName}.xlsx`);
}