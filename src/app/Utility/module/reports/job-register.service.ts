import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import * as XLSX from 'xlsx';
export async function getJobregisterReportDetail(masterServices) {
    const reqBody = {
        companyCode: localStorage.getItem('companyCode'),
        collectionName: "job_detail",
        filter: {}
    }
    const res = await masterServices.masterMongoPost("generic/get", reqBody).toPromise();
    reqBody.collectionName = "cha_detail"
    const resChaEntry = await masterServices.masterMongoPost("generic/get", reqBody).toPromise();
    let jobList = [];
    res.data.map((element, index) => {

        const chaDet = resChaEntry.data ? resChaEntry.data.find((entry) => entry.jobNo === element?.jobId) : null;
        let totalCHAamt = 0;
        if (chaDet) {
            totalCHAamt = chaDet.containorDetail.reduce((total, amt) => total + parseFloat(amt.totalAmt), 0);
        }
        let jobData = {
            "jobNo": element?.jobId || '',
            "ojobDate": element.jobDate,
            "jobDate": formatDocketDate(element?.jobDate || new Date()),
            "cNoteNumber": element.containorDetails && Array.isArray(element.containorDetails) && element.containorDetails.length > 0
                ? element.containorDetails.map(detail => detail.cnoteNo).join(',')
                : "",
            "cNoteDate": formatDocketDate(element.containorDetails && element.containorDetails.length > 0 ? element.containorDetails[0].cnoteDate : ""),
            "containerNumber": element?.nOOFCONT || 0,
            "billingParty": element?.billingParty || '',
            "bookingFrom": element?.fromCity || "",
            "toCity": element?.toCity || "",
            "pkgs": element?.noOfPkg || "",
            "weight": element?.weight || "",
            "transportMode": element?.transportMode || "",
            "noof20ftStd": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "20 ft Standard") : 0,
            "noof40ftStd": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "40 ft Standard") : 0,
            "noof40ftHC": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "40 ft High Cube") : 0,
            "noof45ftHC": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "45 ft High Cube") : 0,
            "noof20ftRf": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "20 ft Reefer") : 0,
            "noof40ftRf": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "40 ft Reefer") : 0,
            "noof40ftHCR": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "40 ft High Cube Reefer") : 0,
            "noof20ftOT": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "20 ft Open Top") : 0,
            "noof40ftOT": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "40 ft Open Top") : 0,
            "noof20ftFR": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "20 ft Flat Rack") : 0,
            "noof40ftFR": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "40 ft Flat Rack") : 0,
            "noof20ftPf": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "20 ft Platform") : 0,
            "noof40ftPf": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "40 ft Platform") : 0,
            "noof20ftTk": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "20 ft Tank") : 0,
            "noof20ftSO": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "20 ft Side Open") : 0,
            "noof40ftSO": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "40 ft Side Open") : 0,
            "noof20ftI": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "20 ft Insulated") : 0,
            "noof20ftH": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "20 ft Hardtop") : 0,
            "noof40ftH": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "40 ft Hardtop") : 0,
            "noof20ftV": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "20 ft Ventilated") : 0,
            "noof20ftT": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "20 ft Tunnel") : 0,
            "noof40ftT": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "40 ft Tunnel") : 0,
            "noofBul": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "Bulktainers") : 0,
            "noofSB": element.blChallan && element.blChallan.length > 0 ? countContainers(element.blChallan, "Swap Bodies") : 0,
            "totalNoofcontainer": element.blChallan ? element.blChallan.length : 0,
            "jobType": element?.jobType == "I" ? "Import" : element?.jobType == "E" ? "Export" : "",
            "chargWt": element?.weight || "",
            "DespatchQty":'0.00',
            "despatchWt":'0.00',
            "poNumber": element?.poNumber || "",
            "totalChaAmt": totalCHAamt || '0.00',
            "voucherAmt":'',
            "vendorBillAmt":'',
            "customerBillAmt":'',
            "status": element?.status === "0" ? "Awaiting CHA Entry" : element.status === "1" ? "Awaiting Rake Entry" : "Awaiting Advance Payment",
            "jobLocation": element?.jobLocation || "",
        }
        // Push the modified job data to the array
        jobList.push(jobData)
    });
    // Return the array of modified job data
    return jobList
}

function countContainers(blChallan, containerType) {
    return blChallan.reduce((count, item) => {
        // Check if the container type matches the specified type
        if (item.containerType === containerType) {
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
