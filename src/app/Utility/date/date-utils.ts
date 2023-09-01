import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { parse } from 'date-fns';
import moment from 'moment';

export function formatDate(dateString: string, format: string): string {
  const date = new Date(dateString);
  const datePipe = new DatePipe('en-US');
  return datePipe.transform(date, format);
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
