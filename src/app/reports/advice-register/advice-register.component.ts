import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import moment from 'moment';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { AdviceRegisterControl } from 'src/assets/FormControls/Reports/Advice-Register/advice-register-control';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-advice-register',
  templateUrl: './advice-register.component.html'
})
export class AdviceRegisterComponent implements OnInit {
  breadScrums = [
    {
      title: "Advice Register Report",
      items: ["Home"],
      active: "Advice Register Report",
    },
  ];
  adviceRegisterForm: UntypedFormGroup
  adviceRegisterControls: AdviceRegisterControl
  jsonControlFormArray: any
  formTitle = "Advice Register Data"
  csvFileName: string; // name of the csv file, when data is downloaded
  source: any[] = []; // Array to hold data
  loading = true // Loading indicator
  LoadTable = false;
  columns = [];

  paging: any;
  sorting: any;
  searching: any;
  columnMenu: any;
  theme: "MATERIAL"
  locationStatus: any;
  locationName: any;
  ReportingBranches: any[];
  drillDownData: any;
  constructor(private fb: UntypedFormBuilder,
    private locationService: LocationService,
    private filter: FilterUtils,
    public snackBarUtilityService: SnackBarUtilityService,
    private storage: StorageService,) { }

  ngOnInit(): void {
    this.initializeFormControl();
    const now = new Date();
    const lastweek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 10
    );
    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.adviceRegisterForm.controls["start"].setValue(lastweek);
    this.adviceRegisterForm.controls["end"].setValue(now);
    this.getDropDownList();
    this.csvFileName = `Advice_Register_Report-${moment().format("YYYYMMDD-HHmmss")}`;
  }
  //#region to initialize form control
  initializeFormControl() {
    this.adviceRegisterControls = new AdviceRegisterControl();
    this.jsonControlFormArray = this.adviceRegisterControls.adviceRegisterControlArray;
    const locationControl = this.jsonControlFormArray.find(data => data.name === "location");

    if (locationControl) {
      this.locationName = locationControl.name;
      this.locationStatus = locationControl.additionalData.showNameAndValue;
    }

    this.adviceRegisterForm = formGroupBuilder(this.fb, [this.jsonControlFormArray]);
  }
  //#endregion
  //#region to get dropdown data
  async getDropDownList() {
    const locationList = await this.locationService.getLocationList();  // Set default values for 'branch' and 'Fyear' controls
    const loginBranch = locationList.find(x => x.value === this.storage.branch);

    this.adviceRegisterForm.controls["location"].setValue(loginBranch);
    this.adviceRegisterForm.get('Individual').setValue("Y");
    this.filter.Filter(
      this.jsonControlFormArray,
      this.adviceRegisterForm,
      locationList,
      this.locationName,
      this.locationStatus
    );

  }
  //#endregion
  //#region to call function handler
  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  //#endregion

  //#region to get data
  //#region to get ledger data to show in table
  async save() {
    this.snackBarUtilityService.commonToast(async () => {
      try {
        const reqBody = await this.getRequestData();
      //  const data = await this.generalLedgerReportService.getGeneralLedger(reqBody)
      //   // console.log(this.drillDownData)

      //   this.columns = transformedHeader;
      //   // this.columns = data.grid.columns;
      //   this.sorting = data.grid.sorting;
      //   this.searching = data.grid.searching;
      //   this.paging = data.grid.paging;
      //   this.source = newdata;
        this.LoadTable = true;

        // if (data.data.length === 0) {
        //   this.LoadTable = false;
        //   this.loading = false;
        //   if (data) {
        //     Swal.fire({
        //       icon: "error",
        //       title: "No Records Found",
        //       text: "Cannot Download CSV",
        //       showConfirmButton: true,
        //     });
        //   }
        //   return;
        // }
        Swal.hideLoading();
        setTimeout(() => {
          Swal.close();
        }, 1000);
        this.loading = false;
      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal(
          "error",
          error.message
        );
      }
    }, "Advice Register Report Generating Please Wait..!");
  }
  //#endregion
  //#region to get request data
  async getRequestData() {
    this.ReportingBranches = [];
    if (this.adviceRegisterForm.value.Individual == "N") {
      // this.ReportingBranches = await this.generalLedgerReportService.GetReportingLocationsList(this.adviceRegisterForm.value.branch.name);
      this.ReportingBranches.push(this.adviceRegisterForm.value.branch.value);
    } else {
      this.ReportingBranches.push(this.adviceRegisterForm.value.branch.value);
    }

    const startDate = new Date(this.adviceRegisterForm.controls.start.value);
    const endDate = new Date(this.adviceRegisterForm.controls.end.value);

    const startValue = moment(startDate).startOf('day').toDate();
    const endValue = moment(endDate).endOf('day').toDate();

    const reportTyp = this.adviceRegisterForm.value.reportTyp;

    const fnYear = this.adviceRegisterForm.value.Fyear.value;
    const category = this.adviceRegisterForm.value.category.name;
    const location = this.ReportingBranches;
    const individual = this.adviceRegisterForm.value.Individual;

    const reqBody = {
      startValue, endValue, reportTyp, fnYear: parseInt(fnYear),
      category, location, individual
    }
    return reqBody
  }
  //#endregion
  //#endregion
}