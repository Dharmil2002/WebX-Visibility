import * as XLSX from 'xlsx';
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
     const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
     // Write the workbook to an Excel file with the specified filename.
     XLSX.writeFile(workbook, `${excelFileName}.xlsx`);
}

export function exportAsExcelFileV2(json: any[], excelFileName: string, customHeaders1: Record<string, string>, sheetName1: string, json2?: any[], customHeaders2?: Record<string, string>, sheetName2?: string): void {
     // Remove the _id field from each row in the JSON data
     const cleanedJson = json.map(row => {
          delete row._id;
          return row;
     });

     // Convert the JSON data to an Excel worksheet using XLSX.utils.json_to_sheet.
     const worksheet1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(cleanedJson);
     // Get the keys (headers) from the first row of the JSON data.
     const headerKeys1 = Object.keys(cleanedJson[0]);
     // Iterate through the header keys and replace the default headers with custom headers.
     for (let i = 0; i < headerKeys1.length; i++) {
          const headerKey = headerKeys1[i];
          if (headerKey && customHeaders1[headerKey]) {
               worksheet1[XLSX.utils.encode_col(i) + '1'] = { t: 's', v: customHeaders1[headerKey] };
          }
     }
     // Format the headers in the worksheet.
     for (const key in worksheet1) {
          if (Object.prototype.hasOwnProperty.call(worksheet1, key)) {
               // Check if the key corresponds to a header cell (e.g., A1, B1, etc.).
               const reg = /^[A-Z]+1$/;
               if (reg.test(key)) {
                    // Set the format of the header cells to '0.00'.
                    worksheet1[key].z = '0.00';
               }
          }
     }

     // If json2 is provided, add it as a second sheet in the workbook
     if (json2) {
          const cleanedJson2 = json2.map(row => {
               delete row._id;
               return row;
          });
          const worksheet2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(cleanedJson2);
          // Get the keys (headers) from the first row of the JSON data.
          const headerKeys2 = Object.keys(cleanedJson2[0]);
          // Iterate through the header keys and replace the default headers with custom headers.
          for (let i = 0; i < headerKeys2.length; i++) {
               const headerKey = headerKeys2[i];
               if (headerKey && customHeaders2 && customHeaders2[headerKey]) {
                    worksheet2[XLSX.utils.encode_col(i) + '1'] = { t: 's', v: customHeaders2[headerKey] };
               }
          }
          // Format the headers in the worksheet.
          for (const key in worksheet2) {
               if (Object.prototype.hasOwnProperty.call(worksheet2, key)) {
                    // Check if the key corresponds to a header cell (e.g., A1, B1, etc.).
                    const reg = /^[A-Z]+1$/;
                    if (reg.test(key)) {
                         // Set the format of the header cells to '0.00'.
                         worksheet2[key].z = '0.00';
                    }
               }
          }
          const workbook: XLSX.WorkBook = { Sheets: { [sheetName1]: worksheet1, [sheetName2 || 'data']: worksheet2 }, SheetNames: [sheetName1, sheetName2 || 'data'] };
          XLSX.writeFile(workbook, `${excelFileName}.xlsx`);
     } else {
          // If json2 is not provided, create a workbook with only the first sheet
          const workbook: XLSX.WorkBook = { Sheets: { [sheetName1]: worksheet1 }, SheetNames: [sheetName1] };
          XLSX.writeFile(workbook, `${excelFileName}.xlsx`);
     }
}
