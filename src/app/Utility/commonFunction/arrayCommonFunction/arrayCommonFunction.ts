import { UntypedFormGroup } from "@angular/forms";
import { AutoComplete } from "src/app/Models/drop-down/dropdown";

/**
 * Removes duplicate objects from an array based on all key-value pairs.
 * @param {Array} objects - The array of objects.
 * @returns {Array} - The array with duplicate objects removed.
 */
export function removeDuplicateObjects(objects: Array<any>): Array<any> {
  const uniqueObjectsSet = new Set(objects.map(obj => JSON.stringify(obj) as string));
  return Array.from(uniqueObjectsSet).map(str => JSON.parse(str));
}

export function removeElementFromArray(arr: any[], key: string, value: any): any[] {
  return arr.filter(item => item[key] !== value);
}

export function getNextLocation(locationsArray: string[], currentLocation: string): string {
  let currentIndex = locationsArray.findIndex(loc => loc === currentLocation);

  if (currentIndex !== -1) {
    const nextIndex = (currentIndex + 1) % locationsArray.length;
    if (nextIndex === 0) {
      return ''; // Reached the last location, don't wrap around
    }
    const nextLocation = locationsArray[nextIndex];
    return nextLocation;
  } else {
    console.error("Current location not found!");
  }

}
// Function to format the date in "dd mm yy hh:mm" format
// Function to format the date in "dd mm yy hh:mm" format
export const formatDateTimeString = (date) => {
  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
// Function to convert numerical strings to integers
export function convertNumericalStringsToInteger(dataObj) {
  for (const prop in dataObj) {
    const value = dataObj[prop];
    // Check if the value is a string, not empty, and a valid number
    if (typeof value === 'string' && value.trim() !== '' && !isNaN(Date.parse(value))) {
      dataObj[prop] = parseInt(value, 10);
    }
  }
  return dataObj;
  }

  export function removeFieldsFromArray(array, fieldsToRemove) {
    return array.map(obj => {
      const newObj = { ...obj }; // Create a shallow copy of the object
      for (const field of fieldsToRemove) {
        delete newObj[field]; // Delete the specified field from the object
      }
      return newObj; // Return the object without the specified fields
    });
  }
  export function removeFields(data, fieldsToRemove) {
    return data.map(obj => {
      const newObj = { ...obj };
      fieldsToRemove.forEach(field => {
        if (newObj.hasOwnProperty(field)) {
          delete newObj[field];
        }
      });
      return newObj;
    });
  }
  
// Function to check if all fields are empty
export function areAllFieldsEmpty(Detail): boolean {
  for (let fields of Detail) {
    for (let key in fields) {
      if (fields.hasOwnProperty(key) && fields[key] !== '') {
        return false; // At least one field is not empty
      }
    }
  }
  return true; // All fields are empty
}
export function updateProperty(arr, propertyToUpdate, propertyToUpdateFrom) {
  return arr.map(item => ({
    ...item,
    [propertyToUpdate]: item[propertyToUpdateFrom]
  }));
}

export async function   total(round,field){
  let count= round.reduce((total, invoice) => {
     return total + parseInt(invoice[field], 10);
   }, 0);
   return count
  }
  export function setGeneralMasterData(controls: any[], data: AutoComplete[], controlName: string)
  {
    const control = controls.find((x) => x.name === controlName);
    if (control) {
      control.value = data;
    }
  }
  export function parseFloatWithFallback(value: any, fallback: number = 0.00): number {
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? fallback : parsedValue;
  }
  
  export function assignDetail(detail: any[], formValue: any): any {
    return detail.length > 0 ? detail : [formValue];
  }
  export const getValueFromJsonControl = (jsonControl, name, value) => {
    const item = jsonControl.find(x => x.name === name);
    if (item) {
        const foundValue = item.value.find(x => x.value === value);
        if (foundValue) {
            return foundValue.name;
        }
    }
    return null;
};

export function aggregateData(data, groupByColumns, aggregationRules, fixedColumns) {
  const groups = {};

  for (const item of data) {
      const key = groupByColumns.map(column =>  item[column] ?? "" ).join('-');                
      if (!groups[key]) {
          groups[key] = { ...item };
          fixedColumns.forEach(fixedColumn => {
              groups[key][fixedColumn.field] = fixedColumn.calculate(item);
          });
      }

      const group = groups[key];

      aggregationRules.forEach(rule => {
          const { inputField, outputField, operation, condition } = rule;
          if(!group[outputField])
              group[outputField]  = undefined;

          if (!condition || condition(item)) {
              if (operation === 'sum' ) {
                  group[outputField] = (group[outputField] || 0) + (item[inputField] || 0);
              } else if (operation === 'first' && group[outputField] === undefined) {
                  group[outputField] = item[inputField];
              }
          }
      });
  }

  const allowedFields = [
      ...groupByColumns,
      ...aggregationRules.map(rule => rule.outputField),
      ...fixedColumns.map(column => column.field),
  ];

  for (const key in groups) {
      if (groups.hasOwnProperty(key)) {
          for (const field in groups[key]) {
              if (!allowedFields.includes(field)) {
                  delete groups[key][field];
              }
          }
      }
  }

  return Object.values(groups);
}


export function latLongValidator(data) {
  const value =data.split(',').map(v => parseFloat(v.trim()));
  const latitude = value[0];
  const longitude = value[1];

  const isValidLatitude = !isNaN(latitude) && latitude >= -90 && latitude <= 90;
  const isValidLongitude = !isNaN(longitude) && longitude >= -180 && longitude <= 180;

  if (!isValidLatitude || !isValidLongitude) {
      return { 'latLongInvalid': true };
  }
  return null;
}
