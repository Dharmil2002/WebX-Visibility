import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.sass'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DatePickerComponent implements OnInit {

  @Output() date1: EventEmitter<any> = new EventEmitter<any>();
  @Input() childDate: Date;
  constructor() { }

  date: any;
  ngOnInit() {
    this.date = this.childDate
    // console.log(this.date);//03/2022/06T12:28:30.513Z
  }
  change(dateEvent) {
    
    this.date1.emit(dateEvent.value)
    //console.log(this.childMessage);

  }

}
