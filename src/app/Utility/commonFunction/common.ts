export function roundToNumber(number: number, decimalPlaces: number = 0): number {
    return Number(number.toFixed(decimalPlaces));
}

export function isValidNumber(value: any): boolean {
    return typeof value === 'number' && Number.isFinite(value) 
           || typeof value === 'string' && !isNaN(Number(value));
}  

export function isValidDate(value: any): boolean {
    const date = new Date(value);
    return !isNaN(date.getTime());
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