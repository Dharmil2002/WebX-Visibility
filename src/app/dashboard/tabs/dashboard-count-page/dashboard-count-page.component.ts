import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CustomeDatePickerComponent } from 'src/app/shared/components/custome-date-picker/custome-date-picker.component';

@Component({
  selector: 'app-dashboard-count-page',
  templateUrl: './dashboard-count-page.component.html',
})
export class DashboardCountPageComponent implements OnInit {
  readonly CustomeDatePickerComponent = CustomeDatePickerComponent;
  isTouchUIActivated = false;
  data: any;
  tableload: boolean;
  csv: any;
  jsonUrl = '../../../assets/data/dashboard-data.json'
  range: FormGroup;

  constructor(private http: HttpClient,
    private DashboardFilterPage: FormBuilder, private datePipe: DatePipe) {
    this.range = this.DashboardFilterPage.group({
      start: new FormControl(),
      end: new FormControl(),
    });
  }
  breadscrums = [
    {
      title: "Gate Management",
      items: ["Home"],
      active: "Gate Pass",
    },
  ];
  ngOnInit(): void {
    const now = new Date();
    const lastweek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 10
    );
    this.range.controls["start"].setValue(lastweek);
    this.range.controls["end"].setValue(now);
    this.http.get(this.jsonUrl).subscribe(res => {
      this.data = res;
      this.tableload = false;
    });
  }
  get() {
    var fdate = this.datePipe.transform(this.range.controls.start.value, "dd MMM yyyy");
    var tdate = this.datePipe.transform(this.range.controls.end.value, "dd MMM yyyy");
    console.log(fdate)
    console.log(tdate)
  }
}
