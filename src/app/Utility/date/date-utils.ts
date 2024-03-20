import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { parse } from 'date-fns';
import moment from 'moment';

export function formatDate(dateString: string, format: string): string {
  if (!dateString || isNaN(new Date(dateString).getTime())) {
    return ''; // Return empty string for invalid date strings or empty inputs
  }

  const date = new Date(dateString);
  const datePipe = new DatePipe('en-US');
  return datePipe.transform(date, format) || ''; // Return formatted date or empty string if format is invalid
}

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string): string {
    const date = moment.utc(value, 'ddd, DD MMM YYYY HH:mm:ss [GMT]');
    return date.format('DD/MM/YYYY HH:mm');
  }
}
export function parseCustomDate(dateString, format) {
  return parse(dateString, format, new Date());
}
const thisYear = new Date().getFullYear();
export const financialYear = `${thisYear.toString().slice(-2)}${(thisYear + 1)
  .toString()
  .slice(-2)}`;
const thisfullYear = (new Date()).getFullYear();
const lastYear = thisYear + 1;
export const finYear = `${thisfullYear}-${lastYear}`;
/*
  The following variables are used to generate a date and time string for a file name.
*/
export const commonCurrentDate = new Date();
export const commonYear = commonCurrentDate.getFullYear();
export const commonMonth = String(commonCurrentDate.getMonth() + 1).padStart(2, '0');
export const commonDay = String(commonCurrentDate.getDate()).padStart(2, '0');
export const commonHours = String(commonCurrentDate.getHours()).padStart(2, '0');
export const commonMinutes = String(commonCurrentDate.getMinutes()).padStart(2, '0');
export const timeString = `${commonDay}${commonMonth}${commonYear}${commonHours}${commonMinutes}`
/*End*/

export function runningNumber() {

  return `${moment().format("YYMMDDHH")}${Math.floor(1000 + Math.random() * 9000)}`
};
