import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { XlsxPreviewPageComponent } from 'src/app/shared-components/xlsx-preview-page/xlsx-preview-page.component';
@Injectable({
  providedIn: 'root',
})
export class xlsxutilityService {
  constructor(private matDialog: MatDialog, private http: HttpClient) {

  }
  validateDataWithApiCall(data: any[], rules: any[]): Observable<any[]> {
    const validatedData = JSON.parse(JSON.stringify(data));
    const validationObservables: Observable<void>[] = [];
    for (const item of validatedData) {
      const errors = [];

      for (const rule of rules) {
        const value = item[rule.ItemsName];
        for (const validation of rule.Validations) {
          if ("Required" in validation && validation.Required && !value) {
            errors.push(`${rule.ItemsName} is required.`);
          }
          // Perform case-insensitive and type-insensitive comparison for TakeFromList
          if ("TakeFromList" in validation && !validation.TakeFromList.some(listItem =>
            String(listItem).toLowerCase() === String(value).toLowerCase())) {
            errors.push(`${rule.ItemsName} is not in the allowed list.`);
          }
          if ("Numeric" in validation && validation.Numeric && isNaN(parseFloat(value))) {
            errors.push(`${rule.ItemsName} must be numeric.`);
          }
          if ("MinValue" in validation && !isNaN(parseFloat(value)) && parseFloat(value) < validation.MinValue) {
            errors.push(`${rule.ItemsName} must be at least ${validation.MinValue}.`);
          }
          if ("MaxValue" in validation && !isNaN(parseFloat(value)) && parseFloat(value) > validation.MaxValue) {
            errors.push(`${rule.ItemsName} must be at least ${validation.MaxValue}.`);
          }
          if ("Pattern" in validation && validation.Pattern instanceof RegExp && !validation.Pattern.test(value)) {
            errors.push(`${rule.ItemsName} does not match the required pattern.`);
          }
          if ("Exists" in validation && validation.Exists.find(listItem =>
            String(listItem).toLowerCase() === String(value).toLowerCase())) {
            errors.push(`${rule.ItemsName} already exists. Please enter another ${rule.ItemsName}.`);
          }
          if ("ApiValidation" in validation && validation.ApiValidation) {
            const apiEndpoint = `YOUR_API_ENDPOINT?pincode=${encodeURIComponent(value)}`;
            const validationObservable = this.http.get(apiEndpoint).pipe(
              map((response: any) => {
                if (!response.valid) {
                  errors.push(`${rule.ItemsName} is not valid.`);
                }
              }),
              catchError(error => {
                console.error(`Error validating ${rule.ItemsName}: ${error.message}`);
                return [];
              })
            );
            validationObservables.push(validationObservable);
          }
        }
      }

      item.error = errors.length > 0 ? errors : null;
    }

    // Always include an observable for each item
    for (const item of validatedData) {
      validationObservables.push(of(null));
    }

    // Filter out data without errors
    const filteredDataWithoutErrors = validatedData.filter((x) => !x.error);

    // Check if there is at least one element without errors and rules are provided
    if (filteredDataWithoutErrors.length > 0 && rules.length > 0) {
      rules.forEach((rule) => {
        const itemsName = rule.ItemsName;
        const duplicateValidation = rule.Validations.find(
          (validation) => "DuplicateFromList" in validation
        );

        if (duplicateValidation) {
          // Add "Duplicate entry" error to the remaining items using forEach
          filteredDataWithoutErrors.forEach((item, index) => {
            if (index > 0 && item[itemsName] !== undefined) {
              item.error = item.error || []; // Ensure error array exists
              item.error.push(`Duplicate Entry for ${itemsName}.`);
            }
          });
        }
      });
    }
    return forkJoin(validationObservables).pipe(
      map(() => validatedData)
    );
  }
  async readFile(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        /* create workbook */
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        resolve(jsonData);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsBinaryString(file);
    });
  }

  OpenPreview(results) {

    const dialogRef = this.matDialog.open(XlsxPreviewPageComponent, {
      data: results,
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        console.log(result);
      }
    });
  }

}