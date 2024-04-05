import { Injectable } from "@angular/core";

import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';

@Injectable({
    providedIn: "root",
})
export class ExportService {

    constructor() { } 

    produceCSV(data: any[], customHeaders: Record<string, string> = null): string {

        let dataForExport = data;
        
        if(customHeaders) {
            dataForExport = data.map(item => {
                const itemForExport = {};
                Object.keys(customHeaders).forEach(key => {
                itemForExport[customHeaders[key]] = item[key];
                });
                return itemForExport;
            });
        }

       return Papa.unparse(dataForExport);
    }
    exportAsCSV(data: any[], fileName, customHeaders: Record<string, string> = null): void {
        
        const csv = this.produceCSV(data, customHeaders);

        // Download CSV file
        const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${fileName}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    exportAsExcelFile(json: any[], excelFileName: string, customHeaders: Record<string, string>): void {
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
}