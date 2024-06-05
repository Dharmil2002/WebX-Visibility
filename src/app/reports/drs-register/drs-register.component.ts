import { Component, OnInit } from '@angular/core';
import { DrsReportControl } from 'src/assets/FormControls/Reports/drs-register/drs-register';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { StorageService } from 'src/app/core/service/storage.service';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import moment from 'moment';
import Swal from 'sweetalert2';
import { GeneralLedgerReportService } from 'src/app/Utility/module/reports/general-ledger-report.service';
import { DrsService } from 'src/app/Utility/module/reports/drs-register-service';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';

@Component({
  selector: 'app-drs-register',
  templateUrl: './drs-register.component.html',  
})
export class DrsRegisterComponent implements OnInit {
  breadScrums = [
    {
      title: "DRS Register Report",
      items: ["Home"],
      active: "DRS Register Report",
    }
  ];
  drsregisterTableForm: UntypedFormGroup
  jsondrsregisterFormArray: any;
  drsregisterFormControl: DrsReportControl
  columns: any;
  sorting: any;
  searching: any;
  paging: any;
  source: any;
  LoadTable: boolean;
  ReportingBranches: string[] = [];
  formTitle = "DRS Register Data"
  csvFileName: string;
  branchName: any;
  branchStatus: any;
  loading = true; // Loading indicator
  showOverlay = false;
  
  constructor(
    public snackBarUtilityService: SnackBarUtilityService,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private locationService: LocationService,
    private Storage:StorageService,
    private masterServices: MasterService,
    private generalLedgerReportService: GeneralLedgerReportService,
    private drsdetails: DrsService,
  ) {     
      this.initializeFormControl()  
  }
  

  ngOnInit(): void {
    const now = new Date();
    const lastweek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 10
    );
    this.drsregisterTableForm.controls["start"].setValue(lastweek);
    this.drsregisterTableForm.controls["end"].setValue(now);
    this.csvFileName = "DRS_Register_Report";
    this.getDropdownData();
  }
  initializeFormControl() {
    this.drsregisterFormControl = new DrsReportControl();
    this.jsondrsregisterFormArray = this.drsregisterFormControl.drsReportControlArray;    
    this.drsregisterTableForm = formGroupBuilder(this.fb, [this.jsondrsregisterFormArray]);
    this.drsregisterTableForm.controls["ReportType"].setValue('Cumulative');
    this.drsregisterTableForm.controls['DocumentStatus'].setValue(5);
    this.branchName = this.jsondrsregisterFormArray.find(
      (data) => data.name === "Location"
    )?.name;
    this.branchStatus = this.jsondrsregisterFormArray.find(
      (data) => data.name === "Location"
    )?.additionalData.showNameAndValue;
  }
  functionCallHandler($event) {
    let functionName = $event.functionName; 
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  async getDropdownData() {
    // const locationList = await this.locationService.locationFromApi();
    // this.filter.Filter(this.jsondrsregisterFormArray, this.drsregisterTableForm, locationList, "Location", false);
    const branchList = await this.locationService.locationFromApi();
    this.filter.Filter(
      this.jsondrsregisterFormArray,
      this.drsregisterTableForm,
      branchList,
      this.branchName,
      this.branchStatus
    );
    const loginBranch = branchList.find(x => x.value === this.Storage.branch);
    this.drsregisterTableForm.controls["Location"].setValue(loginBranch);
    this.drsregisterTableForm.get('Individual').setValue("Y");
  }
  async save(){
    this.loading = true;
    try {
      this.ReportingBranches = [];
      if (this.drsregisterTableForm.value.Individual == "N") {
        this.ReportingBranches = await this.generalLedgerReportService.GetReportingLocationsList(this.drsregisterTableForm.value.Location.value);
        this.ReportingBranches.push(this.drsregisterTableForm.value.Location.value);
      } else {
        this.ReportingBranches.push(this.drsregisterTableForm.value.Location.value);
      }
      const startDate = new Date(this.drsregisterTableForm.controls.start.value);
      const endDate = new Date(this.drsregisterTableForm.controls.end.value);
      const startValue = moment(startDate).startOf('day').toDate();
      const endValue = moment(endDate).endOf('day').toDate();
      const status = this.drsregisterTableForm.value.DocumentStatus;
      const rtype = this.drsregisterTableForm.value.ReportType;      
      const drsNo = this.drsregisterTableForm.value.DocumentNo;
      const DRSArray = drsNo ? drsNo.includes(',') ? drsNo.split(',') : [drsNo] : [];
      const branch = this.ReportingBranches;
      const reqBody = {
        startValue, endValue,  status, rtype, branch, drsNo, DRSArray
      }
      const result = await this.drsdetails.getdrsReportDetail(reqBody);
      console.log("data", result);
      this.columns = result.grid.columns;
      this.sorting = result.grid.sorting; 
      this.searching = result.grid.searching;
      this.paging = result.grid.paging;
      
      this.source = result.data;
      this.LoadTable = true;
      this.showOverlay = true;

      if (this.source.length === 0) {
        if (this.source) {
          Swal.fire({
            icon: "error",
            title: "No Records Found",
            text: "Cannot Download CSV",
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
}
