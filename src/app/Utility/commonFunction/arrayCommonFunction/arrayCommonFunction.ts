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
