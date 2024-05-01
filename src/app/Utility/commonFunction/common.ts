import { parseISO, isValid } from 'date-fns';

export function roundToNumber(number: number, decimalPlaces: number = 0): number {
    return Number(number.toFixed(decimalPlaces));
}

export function isValidNumber(value: any): boolean {
    return typeof value === 'number' && Number.isFinite(value) 
           || typeof value === 'string' && !isNaN(Number(value));
}  

export function isValidDate(value: any): boolean {
    const date = new Date(value);
    const tm = date.getTime();
    if (isNaN(tm) || tm <= 0) {
      return false; // Not a date
  }

  const dt = parseISO(value);
  return isValid(dt);
}

export function ConvertToDate(value: any): Date {
    return isValidDate(value) ? new Date(value) : undefined;
}

export function ConvertToNumber(number: any, decimalPlaces: number = 0): number {
    return isValidNumber(number) ? Number(Number(number).toFixed(decimalPlaces)) : 0;
}

export function sumProperty(list, propertyName) {
    return list.reduce((acc, item) => {
      const value = parseFloat(item[propertyName]);
      return acc + (isNaN(value) ? 0 : value);
    }, 0);
  }

export function  generateCombinations(terms) {
    const combinations = [];
    for (let i = 0; i < terms.length; i++) {
      for (let j = 0; j < terms.length; j++) {
        combinations.push([terms[i], terms[j]]);
      }
    }
    return combinations;
  }