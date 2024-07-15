import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { Observable, catchError, firstValueFrom, forkJoin, map, of } from 'rxjs';
import { XlsxPreviewPageComponent } from 'src/app/shared-components/xlsx-preview-page/xlsx-preview-page.component';
import { chunkArray } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';
import { PinCodeService } from 'src/app/Utility/module/masters/pincode/pincode.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { StateService } from 'src/app/Utility/module/masters/state/state.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { UploadFieldType } from 'src/app/config/myconstants';

@Injectable({
  providedIn: 'root'
})

export class xlsxutilityService {

  constructor(
    private matDialog: MatDialog,
    //private http: HttpClient,
    public storage: StorageService,
    private pincodeService: PinCodeService,
    private locationService: LocationService,
    private stateService: StateService,
    private masterService: MasterService
  ) {

    this.fetchAllPincodeData = this.fetchAllPincodeData.bind(this);
    this.fetchAllLocationData = this.fetchAllLocationData.bind(this);
    this.fetchAllStates = this.fetchAllStates.bind(this);
    this.fetchGeneralMaster = this.fetchGeneralMaster.bind(this);

  }
  //#region to fetch all pincode data
  async fetchAllPincodeData(pinChunks): Promise<any[]> {
    console.log(this.storage.companyCode);
    const chunks = chunkArray(pinChunks, 50);

    const promises = chunks.map(chunk =>
      this.pincodeService.pinCodeDetail({ PIN: { D$in: chunk } })
    );

    const results = await Promise.all(promises);
    return results.flat();  // This will merge all results into a single array
  }
  //#endregion

  //#region to fetch all location data
  async fetchAllLocationData(locationChunks): Promise<any[]> {
    const chunks = chunkArray(locationChunks, 50);

    const promises = chunks.map(chunk =>
      this.locationService.getLocations({
        companyCode: this.storage.companyCode,
        locCode: { D$in: chunk },
        activeFlag: true
      }, { _id: 0, locCode: 1, locName: 1 })
    );
    const result = await Promise.all(promises);
    return result.flat();  // This will merge all results into a single array
  }
  //#endregion

  async fetchAllStates(states): Promise<any> {
    return await this.stateService.getStateWithZone({ ST: { D$in: states } })
  }

  async fetchAllCountries(): Promise<any> {
    return await firstValueFrom(this.masterService.getJsonFileDetails("countryList"));
  }

  async fetchGeneralMaster(codeTypes): Promise<any> {
    return await this.masterService.getGeneralMasterData(codeTypes);
  }

  async validateAllData(data: any[], rules: any[]): Promise<any> {

    const validatedData = [...data];

    const rulesToValidate = rules.filter((x) => (x.Type || UploadFieldType.Upload) == UploadFieldType.Upload);
    const rulesToDerive = rules.filter((x) => (x.Type || UploadFieldType.Upload) == UploadFieldType.Derived);

    //const uniqueRules = rulesToValidate.filter(x => x.Validations.some(validation => 'Unique' in validation && validation.Unique));
    //const uniqueFields = uniqueRules.map(x => x.ItemsName);

    let dataFromDB = {};

    async function processFields(fields: any[], dataKey: string, fetchFunction: (keys: string[]) => Promise<any>) {
      let items = [];

      fields.forEach(field => {
        if(field.Validations.some(x => ("FromGeneralMaster" in x && x.FromGeneralMaster) || ("ExistsInGeneralMaster" in x && x.ExistsInGeneralMaster))){
          items = [...items, ...field.Validations.filter(x => x.CodeType).map(x => x.CodeType).flat()];
        }
        else {
          const extracted = validatedData.map(x =>
            field.Validations.some(x => "IsComaSeparated" in x && x.IsComaSeparated)
            ? x[field.ItemsName]?.split(',').map(x => x.trim()).filter(x => x) || []
            : [x[field.ItemsName]]
          ) || []
          items = [...items, ...extracted.flat()];
        }
      });
      items = [... new Set(items.filter(item => !!item))];

      if (items.length > 0) {
        dataFromDB[dataKey] = await fetchFunction(items);
      }
    }
    //this[functionName](element, item.componentDetails);

    // Define filters for different masters based on validations
    const pincodeFields = rulesToValidate.filter(rule =>
      rule.Validations.some(validation => validation.ExistsInPincodeMaster || validation.FromPincodeMaster)
    );
    const generalMasterFields = rulesToValidate.filter(rule =>
      rule.Validations.some(validation => validation.ExistsInGeneralMaster || validation.FromGeneralMaster)
    );
    const locationMasterFields = rulesToValidate.filter(rule =>
      rule.Validations.some(validation => validation.ExistsInLocationMaster || validation.FromLocationMaster)
    );


    // Process each type of validation field
    if (pincodeFields.length > 0) {
      await processFields(pincodeFields, 'Pincode', this.fetchAllPincodeData);

      const states = [...new Set(dataFromDB['Pincode'].map((x) => x.ST).flat())];
      dataFromDB['State'] = await this.fetchAllStates(states);
    }
    if (generalMasterFields.length > 0) {
      await processFields(generalMasterFields, 'General', this.fetchGeneralMaster);
    }
    if (locationMasterFields.length > 0) {
      await processFields(locationMasterFields, 'Location', this.fetchAllLocationData);
    }
    dataFromDB['Country'] = await this.fetchAllCountries();

    const validationPromises = validatedData.map(item => this.validateSingleItem(item, rulesToValidate, rulesToDerive, dataFromDB));
    const results = await Promise.all(validationPromises);

    // Filter out data without errors
    const filteredDataWithoutErrors = results.filter((x) => !x.error);

    // Check if there is at least one element without errors and rules are provided
    if (filteredDataWithoutErrors.length > 0 && rules.length > 0) {

      // Find the rule that has "DuplicateFromList" validation for the specified field
      const duplicateRules = rules.filter(rule => rule.Validations.some(validation => 'DuplicateFromList' in validation));

      // Iterate through each duplicate rule
      duplicateRules.forEach((duplicateRule) => {
        const existingData = new Set();

        // Iterate through filteredDataWithoutErrors to find duplicates in the specified field
        results.forEach((item) => {
          const fieldValue = item[duplicateRule.ItemsName];

          if (fieldValue) {
            if (existingData.has(fieldValue)) {
              item.error = item.error || [];
              item.error.push(`Duplicate Entry.`);
            } else {
              existingData.add(fieldValue);
            }
          }
        });
      });
    }

     // Filter out objects with error as null
     const objectsWithErrors = results.filter(obj => obj.error !== null).flat();

     // Filter out objects with error not null
     const objectsWithoutErrors = results.filter(obj => obj.error === null).flat();

     // Concatenate the two arrays, putting objects without errors first
     const sortedValidatedData = [...objectsWithoutErrors, ...objectsWithErrors];
     console.log(sortedValidatedData);
     return sortedValidatedData;
  }

  findDuplicateFields(data: any[], fields: string[]): any {
    // Use reduce to create an object where keys are field names and values are objects that track occurrences of each value in that field
    const fieldMaps: Record<string, Record<string, number>> = data.reduce((acc, d) => {
        fields.forEach(field => {
            const value = d[field];
            if (!acc[field]) acc[field] = {};  // Initialize if not already there
            acc[field][value] = (acc[field][value] || 0) + 1;  // Count occurrences
        });
        return acc;
    }, {});

    // Identify fields with duplicates
    const duplicates = fields.filter(field => {
        // Convert the counts object to an array of its values and check if any count is greater than 1
        return Object.values(fieldMaps[field]).some(count => count > 1);
    });

    // Create a response based on the presence of duplicates
    if (duplicates.length > 0) {
        return { isUnique: false, message: `Duplicate values found in fields: ${duplicates.join(', ')}.` };
    } else {
        return { isUnique: true, message: "All fields have unique values."};
    }
  }

  findDuplicateComositeFields(data: any[], fields: string[]): any {
    // Use reduce to create a map where keys are concatenated values of specified fields
    const fieldCombinations: Record<string, number> = data.reduce((acc: Record<string, number>, d) => {
        // Create a unique key by concatenating field values
        const key = fields.map(field => d[field]).join('|');
        acc[key] = (acc[key] || 0) + 1; // Count occurrences of each combination
        return acc;
    }, {});

    // Check if any combination has more than one occurrence
    const hasDuplicates = Object.values(fieldCombinations).some(count => count > 1);

    // Create a response based on the presence of duplicates
    if (hasDuplicates) {
        return { isUnique: false, message: `Duplicate values found in the combination of fields: ${fields.join(', ')}.`};
    } else {
        return { isUnique: true, message: "All combinations of specified fields have unique values."};
    }
  }


  async validateSingleItem(item: any, rulesToValidate: any[], rulesToDerive: any[], dataFromDB: any): Promise<any> {
    const errors = [];
    let preValue, nextValue

    for (const rule of rulesToValidate) {
      const value = item[rule.ItemsName];
      for (const validation of rule.Validations) {
        if ("Required" in validation && validation.Required && !value) {
          errors.push(`${rule.ItemsName} is required.`);
        }
        if ("dateLimit" in validation && value) {
          const { range } = rule.Validations.find((x) => x.range);
          const currentDate = new Date();
          const oneMonthAgo = new Date(currentDate);
          oneMonthAgo.setMonth(currentDate.getMonth() - parseInt(range));
          const oneDay = new Date(currentDate);
          oneDay.setHours(currentDate.getHours() + 1);

          if (!value) {
            errors.push(`${rule.ItemsName} is required.`);
          } else {
            const enteredDate = value;
            if (enteredDate < oneMonthAgo || enteredDate > currentDate) {
              errors.push(
                `${rule.ItemsName} must be within the past or current.`
              );
            }
          }
        }

        if (validation.ExistsInPincodeMaster) {
          var vals = [];
          if(validation.IsComaSeparated) {
            vals = value.split(',').map(x => parseInt(x.trim())).filter(x =>  parseInt(x || 0));
          }
          else {
            vals = [parseInt(value || 0)];
          }

          const pincode = dataFromDB['Pincode'].find(x => vals.includes(parseInt(x.PIN)));
          if (!pincode) {
            errors.push(`${rule.ItemsName} is not valid.`);
          }
        }
        if (validation.ExistsInGeneralMaster) {
          const general = dataFromDB['General'].find(x => x.codeType == validation.CodeType && x.codeDesc == value);
          if (!general) {
            errors.push(`${rule.ItemsName} is not valid.`);
          }
        }
        if (validation.ExistsInLocationMaster) {
          var vals = [];
          if(validation.IsComaSeparated) {
            vals = value.split(',').map(x => x.trim()).filter(x => x);
          }
          else {
            vals = [value];
          }
          const location = dataFromDB['Location'].find(x => vals.includes(x.locCode));
          if (!location) {
            errors.push(`${rule.ItemsName} is not valid.`);
          }
        }

        // Perform case-insensitive and type-insensitive comparison for TakeFromList
        if ("TakeFromList" in validation && value && !validation.TakeFromList.some(listItem =>
          String(listItem).toLowerCase() === String(value).toLowerCase())) {
          errors.push(`${rule.ItemsName} is not in the allowed list.`);
        }
        if ("TakeFromArrayList" in validation && value) {
          const valueItems = String(value).split(',').map(item => item.trim().toLowerCase());
          const invalidItems = valueItems.filter(item => !validation.TakeFromArrayList.some(listItem =>
            String(listItem).toLowerCase() === item
          ));

          if (invalidItems.length > 0) {
            errors.push(`${rule.ItemsName} (${invalidItems.join(', ')}) is not in the allowed list.`);
          }
        }
        if ("Exists" in validation && validation.Exists.find(listItem =>
          String(listItem).toLowerCase() === String(value).toLowerCase())) {
          errors.push(`${rule.ItemsName} already exists. Please enter another ${rule.ItemsName}.`);
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
        if ("Pattern" in validation && value && typeof validation.Pattern === "string") {
          const regexPattern = new RegExp(validation.Pattern);
          if (!regexPattern.test(value)) {
            errors.push(`${rule.ItemsName} does not match the pattern.`);
          }
        }

        if ("CompareMinMaxValue" in validation && validation.CompareMinMaxValue) {
          preValue = item[rule.ItemsName];
          if (preValue && nextValue && nextValue > preValue) {
            errors.push(`MinValue must be less than or equal to MaxValue.`);
          }
          nextValue = preValue;
        }
        // if ("ApiValidation" in validation && validation.ApiValidation) {
        //   const apiEndpoint = `YOUR_API_ENDPOINT?pincode=${encodeURIComponent(value)}`;
        //   const validationObservable = this.http.get(apiEndpoint).pipe(
        //     map((response: any) => {
        //       if (!response.valid) {
        //         errors.push(`${rule.ItemsName} is not valid.`);
        //       }
        //     }),
        //     catchError(error => {
        //       console.error(`Error validating ${rule.ItemsName}: ${error.message}`);
        //       return [];
        //     })
        //   );
        //   validationObservables.push(validationObservable);
        // }
      }
      if (errors.length > 0) {
        break; // Exit the loop if errors are found
      }
    }

    const lookups = {
      'Pincode': (item, rule) => ({ PIN: parseInt(item[rule.BasedOn] || 0) }),
      'Location': (item, rule) => ({ locCode: item[rule.BasedOn] }),
      'General': (item, rule) => ({ codeType: rule.CodeType, codeDesc: item[rule.BasedOn] }),
      'State': (item, rule) => ({ ST: item[rule.BasedOn] }),
      'Country': (item, rule) => ({ Code: item[rule.BasedOn] })
    };

    for (const rule of rulesToDerive) {
      item[rule.ItemsName] = null; // Default to null if no data found or rule doesn't apply
      if(rule.From == 'General'){
        var a = '';
      }

      if (item[rule.BasedOn]) { // Check if the base item exists
        const dbKey = rule.From; // Assuming dataFromDB keys are all lowercase
        const criteria = lookups[rule.From](item, rule); // Get criteria object for finding data
        const dbData = dataFromDB[dbKey]?.find(x =>
          Object.keys(criteria).every(key => x[key] === criteria[key])
        ); // Find the first matching data

        if (dbData) {
          item[rule.ItemsName] = dbData[rule.Field];
        }
      }
    }

    item.error = errors.length > 0 ? errors : null;
    return item; // Or return validation errors
  }

  validateData(data: any[], rules: any[]): Observable<any[]> {
    debugger
    const validatedData = JSON.parse(JSON.stringify(data));
    const validationObservables: Observable<void>[] = [];

    const fieldsToValidate = validatedData.filter((x) => (x.Type || "UPLOAD").toUpperCase() == "UPLOAD");
    for (const item of fieldsToValidate) {
      const errors = [];
      let preValue, nextValue
      for (const rule of rules) {
        const value = item[rule.ItemsName];
        for (const validation of rule.Validations) {
          if ("Required" in validation && validation.Required && !value) {
            errors.push(`${rule.ItemsName} is required.`);
          }
          if ("dateLimit" in validation && value) {
            const { range } = rule.Validations.find((x) => x.range);
            const currentDate = new Date();
            const oneMonthAgo = new Date(currentDate);
            oneMonthAgo.setMonth(currentDate.getMonth() - parseInt(range));
            const oneDay = new Date(currentDate);
            oneDay.setHours(currentDate.getHours() + 1);

            if (!value) {
              errors.push(`${rule.ItemsName} is required.`);
            } else {
              const enteredDate = value;
              if (enteredDate < oneMonthAgo || enteredDate > currentDate) {
                errors.push(
                  `${rule.ItemsName} must be within the past or current.`
                );
              }
            }
          }
          // Perform case-insensitive and type-insensitive comparison for TakeFromList
          if ("TakeFromList" in validation && value && !validation.TakeFromList.some(listItem =>
            String(listItem).toLowerCase() === String(value).toLowerCase())) {
            errors.push(`${rule.ItemsName} is not in the allowed list.`);
          }
          if ("TakeFromArrayList" in validation && value) {
            const valueItems = String(value).split(',').map(item => item.trim().toLowerCase());
            const invalidItems = valueItems.filter(item => !validation.TakeFromArrayList.some(listItem =>
              String(listItem).toLowerCase() === item
            ));

            if (invalidItems.length > 0) {
              errors.push(`${rule.ItemsName} (${invalidItems.join(', ')}) is not in the allowed list.`);
            }
          }
          if ("Exists" in validation && validation.Exists.find(listItem =>
            String(listItem).toLowerCase() === String(value).toLowerCase())) {
            errors.push(`${rule.ItemsName} already exists. Please enter another ${rule.ItemsName}.`);
          }
          if ("MinValue" in validation && !isNaN(parseFloat(value)) && parseFloat(value) < validation.MinValue) {
            errors.push(`${rule.ItemsName} must be at least ${validation.MinValue}.`);
          }
          if ("MaxValue" in validation && !isNaN(parseFloat(value)) && parseFloat(value) > validation.MaxValue) {
            errors.push(`${rule.ItemsName} must be at least ${validation.MaxValue}.`);
          }
          if ("Pattern" in validation && value && typeof validation.Pattern === "string") {
            const regexPattern = new RegExp(validation.Pattern);
            if (!regexPattern.test(value)) {
              errors.push(`${rule.ItemsName} does not match the pattern.`);
            }
          }
          if ("Numeric" in validation && validation.Numeric && isNaN(parseFloat(value))) {
            errors.push(`${rule.ItemsName} must be numeric. `);
          }
          if ("CompareMinMaxValue" in validation && validation.CompareMinMaxValue) {
            preValue = item[rule.ItemsName];
            if (preValue && nextValue && nextValue > preValue) {
              errors.push(`MinValue must be less than or equal to MaxValue.`);
            }
            nextValue = preValue;
          }
          // if ("ApiValidation" in validation && validation.ApiValidation) {
          //   const apiEndpoint = `YOUR_API_ENDPOINT?pincode=${encodeURIComponent(value)}`;
          //   const validationObservable = this.http.get(apiEndpoint).pipe(
          //     map((response: any) => {
          //       if (!response.valid) {
          //         errors.push(`${rule.ItemsName} is not valid.`);
          //       }
          //     }),
          //     catchError(error => {
          //       console.error(`Error validating ${rule.ItemsName}: ${error.message}`);
          //       return [];
          //     })
          //   );
          //   validationObservables.push(validationObservable);
          // }
        }
        if (errors.length > 0) {
          break; // Exit the loop if errors are found
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

      // Find the rule that has "DuplicateFromList" validation for the specified field
      const duplicateRules = rules.filter(rule => rule.Validations.some(validation => 'DuplicateFromList' in validation));

      // Iterate through each duplicate rule
      duplicateRules.forEach((duplicateRule) => {
        const existingData = new Set();

        // Iterate through filteredDataWithoutErrors to find duplicates in the specified field
        filteredDataWithoutErrors.forEach((item) => {
          const fieldValue = item[duplicateRule.ItemsName];

          if (fieldValue) {
            if (existingData.has(fieldValue)) {
              item.error = item.error || [];
              item.error.push(`Duplicate Entry.`);
            } else {
              existingData.add(fieldValue);
            }
          }
        });
      });
    }

    return forkJoin(validationObservables).pipe(
      map(() => {
        // Filter out objects with error as null
        const objectsWithErrors = validatedData.filter(obj => obj.error !== null);

        // Filter out objects with error not null
        const objectsWithoutErrors = validatedData.filter(obj => obj.error === null);

        // Concatenate the two arrays, putting objects without errors first
        const sortedValidatedData = [...objectsWithoutErrors, ...objectsWithErrors];

        return sortedValidatedData;
      })
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

      reader.readAsArrayBuffer(file);
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
