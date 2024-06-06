import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { financialYear } from 'src/app/Utility/date/date-utils';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { GeneralLedgerReportService } from 'src/app/Utility/module/reports/general-ledger-report.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { TDSRegisterControl } from 'src/assets/FormControls/Reports/generate-tds-register-report/generate-tds-register-report';
import Swal from 'sweetalert2';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { GetAccountDetailFromApi, GetSingleCustomerDetailsFromApi, GetSingleVendorDetailsFromApi, customerFromApi, vendorFromApi } from 'src/app/finance/Debit Voucher/debitvoucherAPIUtitlity';
import { TDSRegisterReportService } from 'src/app/Utility/module/reports/generate-tds-register-service';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { autocompleteObjectValidator } from 'src/app/Utility/Validation/AutoComplateValidation';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-generate-tds-register-report',
  templateUrl: './generate-tds-register-report.component.html'
})
export class GenerateTdsRegisterReportComponent implements OnInit {
  breadScrums = [
    {
      title: "Generate TDS Register Report",
      items: ["Home"],
      active: "Generate TDS Register Report",
    },
  ];
  tdsRegisterTableForm: UntypedFormGroup;
  jsonTDSRegisterFormArray: any;
  LoadTable = false;
  formTitle = "Generate TDS Register Report"
  csvFileName: string;
  source: any[] = [];
  columns = [];
  sorting: any;
  columnMenu: any;
  paging: any;
  searching: any;
  loading = true
  theme: "MATERIAL"
  submit = "Save";
  TDSRegisterFormControls: TDSRegisterControl
  financYrName: any;
  financYrStatus: any;
  branchName: any;
  branchStatus: any;
  tdsSecName: any;
  tdsSecStatus: any;
  CustomerNameName: any;
  CustomerNameStatus: any;
  ReportingBranches: string[] = [];
  TDSdata: any;
  protected _onDestroy = new Subject<void>();
  constructor(
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private locationService: LocationService,
    private storage: StorageService,
    private generalLedgerReportService: GeneralLedgerReportService,
    private masterService: MasterService,
    private tdsregisterReportService: TDSRegisterReportService,
    public snackBarUtilityService: SnackBarUtilityService,
  ) {
    this.initializeFormControl();
  }

  //#region  initializeFormControl
  initializeFormControl() {
    this.TDSRegisterFormControls = new TDSRegisterControl();
    this.jsonTDSRegisterFormArray = this.TDSRegisterFormControls.TDSRegisterControlArray;

    // Retrieve and set details for the 'branch' control
    this.branchName = this.jsonTDSRegisterFormArray.find(
      (data) => data.name === "branch"
    )?.name;
    this.branchStatus = this.jsonTDSRegisterFormArray.find(
      (data) => data.name === "branch"
    )?.additionalData.showNameAndValue;

    // Retrieve and set details for the 'Fyear' control
    this.financYrName = this.jsonTDSRegisterFormArray.find(
      (data) => data.name === "Fyear"
    )?.name;
    this.financYrStatus = this.jsonTDSRegisterFormArray.find(
      (data) => data.name === "Fyear"
    )?.additionalData.showNameAndValue;

    // Retrieve and set details for the 'TDSSection' control
    this.tdsSecName = this.jsonTDSRegisterFormArray.find(
      (data) => data.name === "TDSSection"
    )?.name;
    this.tdsSecStatus = this.jsonTDSRegisterFormArray.find(
      (data) => data.name === "TDSSection"
    )?.additionalData.showNameAndValue;

    // Retrieve and set details for the 'customerName' control
    this.CustomerNameName = this.jsonTDSRegisterFormArray.find(
      (data) => data.name === "customerName"
    )?.name;
    this.CustomerNameStatus = this.jsonTDSRegisterFormArray.find(
      (data) => data.name === "customerName"
    )?.additionalData.showNameAndValue;

    this.tdsRegisterTableForm = formGroupBuilder(this.fb, [this.jsonTDSRegisterFormArray]);
  }
  //#endregion

  ngOnInit(): void {
    const now = new Date();
    const lastweek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 10
    );

    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.tdsRegisterTableForm.controls["start"].setValue(lastweek);
    this.tdsRegisterTableForm.controls["end"].setValue(now);
    this.csvFileName = "Generate_TDS_Register_Report";
    this.getDropdownData();
  }

  async getDropdownData() {
    try {
      // Fetch data of TDS Section
      let Accountinglocation = this.storage.branch;
      const responseFromAPITDS = await GetAccountDetailFromApi(
        this.masterService,
        "TDS",
        Accountinglocation
      );
      this.TDSdata = responseFromAPITDS;
      this.filter.Filter(
        this.jsonTDSRegisterFormArray,
        this.tdsRegisterTableForm,
        responseFromAPITDS,
        this.tdsSecName,
        this.tdsSecStatus
      );

      // Fetch data from various services
      const financialYearlist = this.generalLedgerReportService.getFinancialYear();
      const branchList = await this.locationService.locationFromApi();

      // Apply filters for each dropdown
      this.filterDropdown(this.financYrName, this.financYrStatus, financialYearlist);
      this.filterDropdown(this.branchName, this.branchStatus, branchList);
      // Set default values for 'branch' and 'Fyear' controls
      const loginBranch = branchList.find(x => x.value === this.storage.branch);
      const selectedFinancialYear = financialYearlist.find(x => x.value === financialYear);

      this.tdsRegisterTableForm.controls["branch"].setValue(loginBranch);
      this.tdsRegisterTableForm.controls["Fyear"].setValue(selectedFinancialYear);
      this.tdsRegisterTableForm.get('Individual').setValue("Y");
    } catch (error) {
      console.error('An error occurred in getDropdownData:', error.message || error);
    }
  }

  // Function to filter and update dropdown data in the form
  filterDropdown(name: string, status: any, dataList: any[]) {
    this.filter.Filter(this.jsonTDSRegisterFormArray, this.tdsRegisterTableForm, dataList, name, status);
  }

  async PreparedforFieldChanged(event) {
    // Get the current TDS type from the form
    const TDSType = this.tdsRegisterTableForm.value.tdsType;
    // Get the form control for 'custHandler'
    const PartyAs = this.tdsRegisterTableForm.get('custHandler');
    // Clear the value of the 'custHandler' field
    PartyAs.setValue("");
    //const custNameControl = this.jsonTDSRegisterFormArray.find(x => x.name === "customerName");
    // custNameControl.type = "dropdown";

    // Update the validity of the 'custHandler' field
    PartyAs.updateValueAndValidity();
    // Variable to store the API response
    let responseFromAPI = [];

    // Handle the visibility and state of the 'custHandler' field based on TDS type
    if (TDSType === 'Both') {
      PartyAs.disable();  // Disable the 'custHandler' field if TDS type is 'Both'
    } else {
      PartyAs.enable();  // Enable the 'custHandler' field for other TDS types
    }

    // Update the form with the visibility change
    this.tdsRegisterTableForm.updateValueAndValidity();

    // Fetch data from the API and filter the form array based on the TDS type
    switch (TDSType) {
      case 'Payable':
        // Fetch vendor data from the API if TDS type is 'Payable'
        responseFromAPI = await vendorFromApi(this.masterService)
        // Filter the form array with the fetched vendor data
        this.filter.Filter(
          this.jsonTDSRegisterFormArray,
          this.tdsRegisterTableForm,
          responseFromAPI,
          "customerName",
          false
        );
        break;
      case 'Receivable':
        // Fetch customer data from the API if TDS type is 'Receivable'
        responseFromAPI = await customerFromApi(this.masterService)
        // Filter the form array with the fetched customer data
        this.filter.Filter(
          this.jsonTDSRegisterFormArray,
          this.tdsRegisterTableForm,
          responseFromAPI,
          "customerName",
          false
        );
        break;
    }
  }

  async PartyNameFieldChanged(event) {
    // Retrieve the value of 'tdsType' from the form
    const TDSType = this.tdsRegisterTableForm.value.tdsType;
    // Retrieve the value of 'tdsType' from the form
    const custName = this.tdsRegisterTableForm.value.customerName
    // Variable to store the API response
    let responseFromAPI: any;
    // Variable to store the API response
    switch (TDSType) {
      case 'Payable':
        // Call the API to get vendor details if TDSType is 'Payable'
        responseFromAPI = await GetSingleVendorDetailsFromApi(this.masterService, custName.value)
        // Filter the response and update the form accordingly
        this.filter.Filter(
          this.jsonTDSRegisterFormArray,
          this.tdsRegisterTableForm,
          responseFromAPI,
          "custName",
          false
        );
        break;
      case 'Receivable':
        // Call the API to get customer details if TDSType is 'Receivable'
        responseFromAPI = await GetSingleCustomerDetailsFromApi(this.masterService, custName.value)
        // Filter the response and update the form accordingly
        this.filter.Filter(
          this.jsonTDSRegisterFormArray,
          this.tdsRegisterTableForm,
          responseFromAPI,
          "custName",
          false
        )
        break;
    }
  }

  async save() {
    this.loading = true;
    try {
      // Initialize ReportingBranches array
      this.ReportingBranches = [];
      if (this.tdsRegisterTableForm.value.Individual == "N") {
        this.ReportingBranches = await this.generalLedgerReportService.GetReportingLocationsList(this.tdsRegisterTableForm.value.branch.name);
        this.ReportingBranches.push(this.tdsRegisterTableForm.value.branch?.value || '');
      } else {
        this.ReportingBranches.push(this.tdsRegisterTableForm.value.branch?.value || '');
      }
      const startDate = new Date(this.tdsRegisterTableForm.controls.start.value);
      const endDate = new Date(this.tdsRegisterTableForm.controls.end.value);

      const startValue = moment(startDate).startOf('day').toDate();
      const endValue = moment(endDate).endOf('day').toDate();

      // Extract form values
      const fnYear = this.tdsRegisterTableForm.value.Fyear.value;
      const branch = this.ReportingBranches;
      const individual = this.tdsRegisterTableForm.value.Individual;

      // const documentNo = this.tdsRegisterTableForm.value.docNo;
      // const docNoArray = documentNo.includes(',') ? documentNo.split(',') : [documentNo];
      // const voucherNo = this.tdsRegisterTableForm.value.voucherNo;
      // const vouNoArray = voucherNo.includes(',') ? voucherNo.split(',') : [voucherNo];

      // Helper function to split comma-separated values or return as array
      const splitValues = (value) => value.includes(',') ? value.split(',') : [value];
      // Extract and process document numbers and voucher numbers
      const docNoArray = splitValues(this.tdsRegisterTableForm.value.docNo);
      const vouNoArray = splitValues(this.tdsRegisterTableForm.value.voucherNo);

      // Extract and process customer names and TDS sections
      const processHandlerArray = (handler) =>
        Array.isArray(handler) ? handler.map(x => ({ CD: x.value, Nm: x.name })) : [];
      const custName = processHandlerArray(this.tdsRegisterTableForm.value.custHandler);
      const tdsSection = processHandlerArray(this.tdsRegisterTableForm.value.tdsSectionHandler);
      // // const custName = this.tdsRegisterTableForm.value.customerName.value;
      // const custName = Array.isArray(this.tdsRegisterTableForm.value.custHandler)
      //   ? this.tdsRegisterTableForm.value.custHandler.map(x => { return { CustCD: x.value, CustNm: x.name }; })
      //   : [];
      // // const tdsSection = this.tdsRegisterTableForm.value.TDSSection;
      // const tdsSection = Array.isArray(this.tdsRegisterTableForm.value.tdsSectionHandler)
      //   ? this.tdsRegisterTableForm.value.tdsSectionHandler.map(x => { return { CD: x.value, Nm: x.name }; })
      //   : [];

      const msme = this.tdsRegisterTableForm.value?.msmeRegistered || false;
      const tdsPayStat = this.tdsRegisterTableForm.value.msmeRegistered;
      console.log("tdsPayStat", tdsPayStat);

      const reqBody = {
        docNoArray, vouNoArray, fnYear: parseInt(fnYear), branch, individual, custName, startValue, endValue, tdsSection, msme
      }
      const result = await this.tdsregisterReportService.getTDSRegisterDetail(reqBody);

      this.columns = result.grid.columns;
      this.sorting = result.grid.sorting;
      this.searching = result.grid.searching;
      this.paging = result.grid.paging;

      this.source = result.data.data.data;
      this.LoadTable = true;
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

  validateDateRange(event): void {
    // Get the values from the form controls
    const startControlValue = this.tdsRegisterTableForm.controls.start.value;
    const endControlValue = this.tdsRegisterTableForm.controls.end.value;
    const selectedFinancialYear = this.tdsRegisterTableForm.controls.Fyear.value;

    // Check if both start and end dates are selected
    if (!startControlValue || !endControlValue) {
      // Exit the function if either start or end date is not selected
      return;
    }

    // Convert the control values to Date objects
    const startDate = new Date(startControlValue);
    const endDate = new Date(endControlValue);

    // Determine the financial year based on the start date
    const startYear = startDate.getFullYear(); // Extract the year from the start date

    // Determine the financial year start
    // If the month of the start date is less than March (0-based index, so 3 is April),
    // it means the financial year started in the previous year.
    // For example, if the start date is February 2024, the financial year started in April 2023.
    const financialYearStart = startDate.getMonth() < 3 ? startYear - 1 : startYear;

    // Calculate the financial year string in the format 'YYYYYYYY'
    // The financial year string is a combination of the last two digits of the start year and the last two digits of the next year.
    // For example, if the financial year started in 2023, the financial year string will be '2324'.
    const calculatedFnYr = `${financialYearStart.toString().slice(-2)}${(financialYearStart + 1).toString().slice(-2)}`;

    // Check if the selected financial year matches the calculated financial year
    if (selectedFinancialYear.value === calculatedFnYr) {

      // Define the financial year date range
      // Parse the selected financial year to get the start year (e.g., '2324' -> 2023)
      const year = parseInt(selectedFinancialYear.value.slice(0, 2), 10) + 2000; // Get the full year from the financial year string
      const minDate = new Date(year, 3, 1);  // April 1 of the calculated year
      const maxDate = new Date(year + 1, 2, 31); // March 31 of the next year

      // Check if both dates fall within the specified financial year range
      if (startDate >= minDate && startDate <= maxDate && endDate >= minDate && endDate <= maxDate) {
        // Both dates are within the valid range
        console.log('Both dates are within the valid range.');
      } else {
        // Show a warning if the date range is not within the financial year
        this.dateRangeWarning(selectedFinancialYear);
        this.clearDateControls();
      }
    }
    else {
      // Show a warning if the date range is not within the financial year
      this.dateRangeWarning(selectedFinancialYear);
      this.clearDateControls();
    }
  }

  dateRangeWarning(selectedFinancialYear): void {
    Swal.fire({
      icon: "warning",
      title: "Warning",
      text: `Date range not within FY ${selectedFinancialYear.name}`,
      showConfirmButton: true,
    });
  }

  clearDateControls(): void {
    this.tdsRegisterTableForm.controls["start"].setValue("");
    this.tdsRegisterTableForm.controls["end"].setValue("");
  }

  //#region to reset date range
  resetDateRange() {
    this.tdsRegisterTableForm.controls["start"].setValue("");
    this.tdsRegisterTableForm.controls["end"].setValue("");
  }
  //#endregion

  //#region to call toggle function
  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonTDSRegisterFormArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonTDSRegisterFormArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.tdsRegisterTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }
  //#endregion

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
}
