import { Injectable } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxMatMomentAdapter,  NGX_MAT_MOMENT_FORMATS  } from '@angular-material-components/moment-adapter';
import * as moment from 'moment';

@Injectable()
export class CustomDateAdapter extends NgxMatMomentAdapter {
  constructor(dateLocale: string, private adapterOptions?: any) {
    super(dateLocale, adapterOptions);
  }

  format(date: moment.Moment, displayFormat: string): string {
    // Custom formatting logic here
    // Example: Always display dates in "DD MMM YYYY HH:mm:ss" format for UI display
    if (!date.isValid()) {
      return '';
    }
    //'DD MMM YY HH:mm'
    return date.format(displayFormat);
  }

  // Optionally override other methods to customize behavior further
}
