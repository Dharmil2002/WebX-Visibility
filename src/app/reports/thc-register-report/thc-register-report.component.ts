import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { thcreportService } from 'src/app/Utility/module/reports/thc-register-service';
import { thcReportControl } from 'src/assets/FormControls/Reports/thc-register/thc-register';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-thc-register-report',
  templateUrl: './thc-register-report.component.html'
})
export class ThcRegisterReportComponent implements OnInit {
  breadScrums = [
    {
      title: "THC Register Report",
      items: ["Home"],
      active: "THC Register Report",
    }
  ];
  thcregisterFormControl: thcReportControl
  jsonthcregisterFormArray: any;
  thcregisterTableForm: UntypedFormGroup
  source: any[] = []; // Array to hold data
  loading:boolean = true // Loading indicator
  LoadTable:boolean=false; 
  //#region Table 
  columns = [];
  csvFileName: string;
  showOverlay:boolean = false;
  //#endregion

  paging: any ;
  sorting: any ;
  searching: any ;
  columnMenu: any ;
  theme: "MATERIAL"
  constructor(private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private locationService: LocationService,
    private thcreportservice: thcreportService,
    public snackBarUtilityService: SnackBarUtilityService)
    {this.initializeFormControl() }

  ngOnInit(): void {
    const now = new Date();
    const lastweek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 10
    );
    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.thcregisterTableForm.controls["start"].setValue(lastweek);
    this.thcregisterTableForm.controls["end"].setValue(now);
    this.csvFileName = "THC_Register_Report";
    this.getDropdownData();
  }
  async getDropdownData() {
    const locationList = await this.locationService.locationFromApi();
    this.filter.Filter(this.jsonthcregisterFormArray, this.thcregisterTableForm, locationList, "Location", false);
  }
  initializeFormControl() {
    this.thcregisterFormControl = new thcReportControl();
    this.jsonthcregisterFormArray = this.thcregisterFormControl.thcReportControlArray;
    this.thcregisterTableForm = formGroupBuilder(this.fb, [this.jsonthcregisterFormArray]);
  }
  async save() {
    try
    {
    const startValue = new Date(this.thcregisterTableForm.controls.start.value);
    const endValue = new Date(this.thcregisterTableForm.controls.end.value);
    const THCNo = this.thcregisterTableForm.value.DocumentNo;
    const THCArray = THCNo ? THCNo.includes(',') ? THCNo.split(',') : [THCNo] : [];
    const DocumentStatus = this.thcregisterTableForm.value.DocumentStatus;
    const ReportType = this.thcregisterTableForm.value.ReportType;
    const Location = this.thcregisterTableForm.value.Location.value;
    const reqBody = {
      startValue, endValue, THCArray, DocumentStatus, ReportType, Location
    }
    const result = await this.thcreportservice.getthcReportDetail(reqBody)
      this.columns = result.grid.columns;
      this.sorting = result.grid.sorting; 
      this.searching = result.grid.searching;
      this.paging = result.grid.paging;
      this.showOverlay = true;
      this.source = result.data;
      this.LoadTable = true;
      if (this.source.length === 0) {
        if (this.source) {
          Swal.fire({
            icon: "error",
            title: "No Records Found",
            text: "Cannot Found Data For Selected Criteria",
            showConfirmButton: true,
          });
        }
        return;
      }
      this.loading = false;
    } catch (error) {
      this.snackBarUtilityService.ShowCommonSwal("error", error.message);
    }
  }
  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
    }
  }
}
