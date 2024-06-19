import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import moment from 'moment';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { AdviceRegisterReportService } from 'src/app/Utility/module/reports/advice-register-report.service';
import { GeneralLedgerReportService } from 'src/app/Utility/module/reports/general-ledger-report.service';
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
  constructor(private fb: UntypedFormBuilder,
    private locationService: LocationService,
    private filter: FilterUtils,
    public snackBarUtilityService: SnackBarUtilityService,
    private storage: StorageService,
    private generalLedgerReportService: GeneralLedgerReportService,
    private adviceRegisterReportService: AdviceRegisterReportService) { }

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
  //#region to get data to show in table
  async save() {
    // Display a toast message while the report is being generated
    this.snackBarUtilityService.commonToast(async () => {
      try {
        let ReportingBranches = [];
        // Check if the form is for individual or multiple locations
        if (this.adviceRegisterForm.value.Individual == "N") {
          // If multiple, get the reporting locations list based on the selected location
          ReportingBranches = await this.generalLedgerReportService.GetReportingLocationsList(this.adviceRegisterForm.value.location.value);
          // Add the selected location to the reporting branches list
          ReportingBranches.push(this.adviceRegisterForm.value.location.value);
        } else {
          // If individual, just add the selected location
          ReportingBranches.push(this.adviceRegisterForm.value.location.value);
        }

        // Convert start and end dates to Date objects
        const startDate = new Date(this.adviceRegisterForm.controls.start.value);
        const endDate = new Date(this.adviceRegisterForm.controls.end.value);

        // Use moment.js to set the start date to the beginning of the day and the end date to the end of the day
        const startValue = moment(startDate).startOf('day').toDate();
        const endValue = moment(endDate).endOf('day').toDate();

        // Handle single and multiple selection for advice type, status, and payment mode
        const advicetype = Array.isArray(this.adviceRegisterForm.value.Advicetype) ? '' : this.adviceRegisterForm.value.Advicetype;
        const Status = Array.isArray(this.adviceRegisterForm.value.Status) ? '' : this.adviceRegisterForm.value.Status;
        const PaymentMode = Array.isArray(this.adviceRegisterForm.value.PaymentMode) ? '' : this.adviceRegisterForm.value.PaymentMode;

        const location = ReportingBranches;
        const docummentNo = this.adviceRegisterForm.value.AdviceNo;

        // Split document number by comma if present, and trim spaces
        let docNoArray;
        if (Array.isArray(docummentNo) && docummentNo.length === 0) {
          docNoArray = [];
        } else {
          docNoArray = docummentNo.includes(',')
            ? docummentNo.split(',').map(value => value.trim())
            : [docummentNo.trim()];
        }
        // Prepare the request body with mandatory fields
        const reqBody = { startValue, endValue, advicetype, Status, location }
        // Prepare the request with optional fields
        const optionalRequest = { PaymentMode, docNoArray }

        // Call the service to get the advice register report
        const data = await this.adviceRegisterReportService.getAdviceRegister(reqBody, optionalRequest)

        // Update the UI with the data received from the report
        this.columns = data.grid.columns;
        this.sorting = data.grid.sorting;
        this.searching = data.grid.searching;
        this.paging = data.grid.paging;
        this.source = data.data;
        this.LoadTable = true;

        // If no data is returned, show an error message and do not load the table
        if (data.data.length === 0) {
          this.LoadTable = false;
          this.loading = false;
          if (data) {
            Swal.fire({
              icon: "error",
              title: "No Records Found",
              text: "Cannot Download CSV",
              showConfirmButton: true,
            });
          }
          return;
        }
        // Close the loading Swal after a short delay
        Swal.hideLoading();
        setTimeout(() => {
          Swal.close();
        }, 1000);
        this.loading = false;
      } catch (error) {
        // Show an error message if the try block fails
        this.snackBarUtilityService.ShowCommonSwal(
          "error",
          error.message
        );
      }
    }, "Advice Register Report Generating Please Wait..!");
  }
  //#endregion  
}