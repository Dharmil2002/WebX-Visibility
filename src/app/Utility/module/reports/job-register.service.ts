import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import * as XLSX from 'xlsx';
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import { firstValueFrom } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})

export class JobRegisterService {
    constructor(
        private masterServices: MasterService,
        private storage: StorageService
    ) { }

    async getJobregisterReportDetail(start, end) {
        const startValue = start;
        const endValue = end;
        const reqBody = {
            companyCode: this.storage.companyCode,
            collectionName: "job_header",
            filter: {
                cID: this.storage.companyCode,
                "D$and": [
                    {
                        "jDT": {
                            "D$gte": startValue
                        }
                    },
                    {
                        "jDT": {
                            "D$lte": endValue
                        }
                    }
                ]
            }
        }
        const res = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
        reqBody.collectionName = "job_details"
        const resjobdetails = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
        reqBody.collectionName = "job_challans"
        const resjobchallans = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
        reqBody.collectionName = "dockets"
        const resdockets = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
        reqBody.collectionName = "cha_headers"
        const reschaheader = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
        reqBody.collectionName = "cha_details"
        const reschadetails = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
        reqBody.collectionName = "docket_ops_det"
        const resdocketops = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
        reqBody.collectionName = "vend_bill_det"
        const resvendBill = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
        reqBody.collectionName = "cust_bill_headers"
        const rescustBill = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", reqBody));
        let jobList = [];
        res.data.map((element) => {
            const docketsDet = resdockets.data ? resdockets.data.filter((entry) => entry.jOBNO === element?.jID) : null;
            const docketsDetVen = resdockets.data ? resdockets.data.find((entry) => entry.jOBNO === element?.jID) : null;
            const jobchallansDet = resjobchallans.data ? resjobchallans.data.filter((entry) => entry.jID === element?.jID) : null;
            const chaheaderDet = reschaheader.data ? reschaheader.data.find((entry) => entry.jID === element?.jID) : null;
            const chaDet = reschadetails.data ? reschadetails.data.find((entry) => entry.cHAID === chaheaderDet?.cHAID) : null;
            const docOpsDet = resdocketops.data ? resdocketops.data.find((entry) => entry.dKTNO === docketsDetVen?.dKTNO) : null;
            const vendorBillDet = resvendBill.data ? resvendBill.data.find((entry) => entry.tRIPNO === docOpsDet?.tHC) : null;
            const custBillDet = rescustBill.data ? rescustBill.data.find((entry) => entry.cUST.nM === docketsDetVen?.bPARTYNM) : null;

            const containerNumbers = jobchallansDet ? jobchallansDet.map(entry => entry.cNNO).join(', ') : "";
            const docketsNumbers = docketsDet ? docketsDet.map(entry => entry.dKTNO).join(', ') : "";
            const actualweight = docketsDet ? docketsDet.map(entry => entry.aCTWT).join(', ') : "";
            const docketDates = docketsDet ? docketsDet.map(entry => entry.dKTDT).join(', ') : "";
            const JobMode = docketsDet ? docketsDet.map(entry => entry.mODNM).join(', ') : "";
            const charWeight = docketsDet ? docketsDet.map(entry => entry.cHRWT).join(', ') : "";
            let jobData = {
                "jobNo": element?.jID || '',
                "jobDate": formatDocketDate(element?.jDT || new Date()),
                "cNoteNumber": docketsNumbers,
                "cNoteDate": formatDocketDate(docketDates ? docketDates.split(', ')[0] : new Date()),
                "containerNumber": containerNumbers,
                "billingParty": element?.bPARTYNM || '',
                "bookingFrom": element?.fCT || "",
                "toCity": element?.tCT || "",
                "pkgs": element?.pKGS || "",
                "weight": actualweight,
                "jobMode": element?.tMODENM || "",
                "noof20ftStd": jobchallansDet ? countContainers(jobchallansDet, "20 ft Standard") : 0,
                "noof40ftStd": jobchallansDet ? countContainers(jobchallansDet, "40 ft Standard") : 0,
                "noof45ftHC": jobchallansDet ? countContainers(jobchallansDet, "45 ft High Cube") : 0,
                "noof20ftRf": jobchallansDet ? countContainers(jobchallansDet, "20 ft Reefer") : 0,
                "noof40ftRf": jobchallansDet ? countContainers(jobchallansDet, "40 ft Reefer") : 0,
                "noof40ftHCR": jobchallansDet ? countContainers(jobchallansDet, "40 ft High Cube Reefer") : 0,
                "noof20ftOT": jobchallansDet ? countContainers(jobchallansDet, "20 ft Open Top") : 0,
                "noof40ftOT": jobchallansDet > 0 ? countContainers(jobchallansDet, "40 ft Open Top") : 0,
                "noof20ftFR": jobchallansDet > 0 ? countContainers(jobchallansDet, "20 ft Flat Rack") : 0,
                "noof40ftFR": jobchallansDet > 0 ? countContainers(jobchallansDet, "40 ft Flat Rack") : 0,
                "noof20ftPf": jobchallansDet > 0 ? countContainers(jobchallansDet, "20 ft Platform") : 0,
                "noof40ftPf": jobchallansDet > 0 ? countContainers(jobchallansDet, "40 ft Platform") : 0,
                "noof20ftTk": jobchallansDet > 0 ? countContainers(jobchallansDet, "20 ft Tank") : 0,
                "noof20ftSO": jobchallansDet > 0 ? countContainers(jobchallansDet, "20 ft Side Open") : 0,
                "noof40ftSO": jobchallansDet > 0 ? countContainers(jobchallansDet, "40 ft Side Open") : 0,
                "noof20ftI": jobchallansDet > 0 ? countContainers(jobchallansDet, "20 ft Insulated") : 0,
                "noof20ftH": jobchallansDet > 0 ? countContainers(jobchallansDet, "20 ft Hardtop") : 0,
                "noof40ftH": jobchallansDet > 0 ? countContainers(jobchallansDet, "40 ft Hardtop") : 0,
                "noof20ftV": jobchallansDet > 0 ? countContainers(jobchallansDet, "20 ft Ventilated") : 0,
                "noof20ftT": jobchallansDet > 0 ? countContainers(jobchallansDet, "20 ft Tunnel") : 0,
                "noof40ftT": jobchallansDet > 0 ? countContainers(jobchallansDet, "40 ft Tunnel") : 0,
                "noofBul": jobchallansDet > 0 ? countContainers(jobchallansDet, "Bulktainers") : 0,
                "noofSB": jobchallansDet > 0 ? countContainers(jobchallansDet, "Swap Bodies") : 0,
                "totalNoofcontainer": jobchallansDet ? jobchallansDet.length : 0,
                "jobType": JobMode,
                "chargWt": charWeight,
                "DespatchQty": '0',
                "despatchWt": '0',
                "poNumber": element?.pONO || "",
                "totalChaAmt": chaDet?.tOTAMT || '0.00',
                "voucherAmt": '0.00',
                "vendorBillAmt": vendorBillDet?.tHCAMT || '0.00',
                "customerBillAmt": custBillDet?.aMT || '0.00',
                "status": element?.sTSNM || '',
                "jobLocation": element?.lOC || "",
            }
            // Push the modified job data to the array
            jobList.push(jobData)
        });
        return jobList
    }
}

function countContainers(blChallan, containerType) {
    return blChallan.reduce((count, item) => {
        // Check if the container type matches the specified type
        if (item.cNTYP === containerType) {
            return count + 1;
        }
        return count;
    }, 0);
}

export function convertToCSV(data: any[], excludedColumns: string[] = [], headerMapping: Record<string, string>): string {
    const escapeCommas = (value: any): string => {
        // Check if value is null or undefined before calling toString
        if (value == null) {
            return '';
        }

        // If the value contains a comma, wrap it in double quotes
        const strValue = value.toString();
        return strValue.includes(',') ? `"${strValue}"` : strValue;
    };

    // Map the original column names to the desired header names
    const header = Object.keys(data[0])
        .filter(column => !excludedColumns.includes(column))
        .map(column => escapeCommas(headerMapping[column] || column))
        .join(',') + '\n';

    // Filter out excluded columns from rows
    const rows = data.map(row => {
        const filteredRow = Object.entries(row)
            .filter(([key]) => !excludedColumns.includes(key))
            .map(([key, value]) => escapeCommas(value))
            .join(',');
        return filteredRow + '\n';
    });

    return header + rows.join('');
}

export function exportAsExcelFile(json: any[], excelFileName: string, customHeaders: Record<string, string>): void {
    // Convert the JSON data to an Excel worksheet using XLSX.utils.json_to_sheet.
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    // Get the keys (headers) from the first row of the JSON data.
    const headerKeys = Object.keys(json[0]);
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
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    // Write the workbook to an Excel file with the specified filename.
    XLSX.writeFile(workbook, `${excelFileName}.xlsx`);
}
