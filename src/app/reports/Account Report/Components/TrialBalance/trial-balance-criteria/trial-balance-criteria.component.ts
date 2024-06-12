import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import Swal from 'sweetalert2';
import moment from 'moment';
import { finYear, financialYear, timeString } from 'src/app/Utility/date/date-utils';
import { GeneralLedgerReportService } from 'src/app/Utility/module/reports/general-ledger-report.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { StorageService } from 'src/app/core/service/storage.service';
import { Subject, firstValueFrom, take, takeUntil } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { AccountReportService } from 'src/app/Utility/module/reports/accountreports';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TrialBalanceReport } from 'src/assets/FormControls/Reports/Account Reports/TrialBalanceReport';
@Component({
  selector: 'app-trial-balance-criteria',
  templateUrl: './trial-balance-criteria.component.html'
})
export class TrialBalanceCriteriaComponent implements OnInit {
  TrialBalanceFormControl: TrialBalanceReport;
  jsonproftandlossArray: any;

  breadScrums = [
    {
      title: "Trial Balance Report",
      items: ["Report"],
      active: "Trial Balance Report",
    },
  ];
  protected _onDestroy = new Subject<void>();
  TrialBalanceForm: UntypedFormGroup;

  branchName: any;
  branchStatus: any;
  report: string[] = [];
  accountName: any;
  accountStatus: any;
  allData: {
    accountNmData: any;
  };
  accDetailList: any;
  accNMDet: any;

  reqBody: {
    ReportType: string;
    FinanceYear: string;
    startdate: Date;
    enddate: Date;
    branch: string[];
    accountCode: string[];
  };
  EndDate: any = moment().format("DD MMM YY");
  financYrName: any;
  financYrStatus: any;
  now = moment().endOf('day').toDate();
  lastweek = moment().add(-10, 'days').startOf('day').toDate();

  constructor(
    private fb: UntypedFormBuilder,
    public snackBarUtilityService: SnackBarUtilityService,
    private accountReportService: AccountReportService,
    private generalLedgerReportService: GeneralLedgerReportService,
    private locationService: LocationService,
    private filter: FilterUtils,
    private router: Router,
    private storage: StorageService,
    private masterServices: MasterService
  ) {
    this.initializeFormControl();
  }
  initializeFormControl() {
    this.TrialBalanceFormControl = new TrialBalanceReport();
    this.jsonproftandlossArray = this.TrialBalanceFormControl.TrialBalanceControlArray;
    this.branchName = this.jsonproftandlossArray.find(
      (data) => data.name === "branch"
    )?.name;
    this.branchStatus = this.jsonproftandlossArray.find(
      (data) => data.name === "branch"
    )?.additionalData.showNameAndValue;

    // Retrieve and set details for the 'Fyear' control
    this.financYrName = this.getControlDetails("Fyear")?.name;
    this.financYrStatus = this.getControlDetails("Fyear")?.status;
    // Retrieve and set details for the 'aCCONTCD' control
    this.accountName = this.getControlDetails("aCCONTCD")?.name;
    this.accountStatus = this.getControlDetails("aCCONTCD")?.status;

    this.TrialBalanceForm = formGroupBuilder(this.fb, [this.jsonproftandlossArray]);
  }
  filterDropdown(name: string, status: any, dataList: any[]) {
    this.filter.Filter(this.jsonproftandlossArray, this.TrialBalanceForm, dataList, name, status);
  }
  getControlDetails = (name: string) => {

    // Find the control in jsonGeneralLedgerArray
    const control = this.jsonproftandlossArray.find(data => data.name === name);

    // Return an object with control name and status (if found)
    return {
      name: control?.name,
      status: control?.additionalData.showNameAndValue,
    };
  };
  ngOnInit(): void {
    const now = moment().endOf('day').toDate();
    const lastweek = moment().add(-10, 'days').startOf('day').toDate()

    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.TrialBalanceForm.controls["start"].setValue(lastweek);
    this.TrialBalanceForm.controls["end"].setValue(now);
    this.getDropDownList();
  }

  async getDropDownList() {
    const branchList = await this.locationService.locationFromApi();

    this.filter.Filter(
      this.jsonproftandlossArray,
      this.TrialBalanceForm,
      branchList,
      this.branchName,
      this.branchStatus
    );
    const loginBranch = branchList.find(x => x.value === this.storage.branch);
    this.TrialBalanceForm.controls["branch"].setValue(loginBranch);
    this.TrialBalanceForm.get('Individual').setValue("Y");
    const financialYearlist = this.generalLedgerReportService.getFinancialYear();
    const accountList = await this.generalLedgerReportService.getAccountDetail();
    this.filterDropdown(this.financYrName, this.financYrStatus, financialYearlist);
    this.filterDropdown(this.accountName, this.accountStatus, accountList);
    // set Deafult Fin Year
    const selectedFinancialYear = financialYearlist.find(x => x.value === financialYear);
    this.TrialBalanceForm.controls["Fyear"].setValue(selectedFinancialYear);

    this.filter.Filter(
      this.jsonproftandlossArray,
      this.TrialBalanceForm,
      ReportType,
      "ReportType",
      false
    );
    this.TrialBalanceForm.get('ReportType').setValue(ReportType[0]);
  }

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
  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonproftandlossArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonproftandlossArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.TrialBalanceForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }
  //#region to validate date range according to financial year
  validateDateRange(event): void {

    // Get the values from the form controls
    const startControlValue = this.TrialBalanceForm.controls.start.value;
    const endControlValue = this.TrialBalanceForm.controls.end.value;
    const selectedFinancialYear = this.TrialBalanceForm.controls.Fyear.value;

    // Check if both start and end dates are selected
    if (!startControlValue || !endControlValue) {
      // Exit the function if either start or end date is not selected
      return;
    }

    // Convert the control values to Date objects
    const startDate = new Date(startControlValue);
    const endDate = new Date(endControlValue);

    const startYear = startDate.getFullYear(); // Extract the year from the start date
    const financialYearStart = startDate.getMonth() < 3 ? startYear - 1 : startYear;

    const calculatedFnYr = `${financialYearStart.toString().slice(-2)}${(financialYearStart + 1).toString().slice(-2)}`;

    if (selectedFinancialYear.value === calculatedFnYr) {

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
  // Function to display a warning message if the date range is not within the selected financial year
  dateRangeWarning(selectedFinancialYear): void {
    Swal.fire({
      icon: "warning",
      title: "Warning",
      text: `Date range not within FY ${selectedFinancialYear.name}`,
      showConfirmButton: true,
    });
  }
  // Function to clear the date range controls
  clearDateControls(): void {
    this.TrialBalanceForm.controls["start"].setValue("");
    this.TrialBalanceForm.controls["end"].setValue("");
  }
  //#endregion
  //#region to set party name according to received from data
  async reportSubTypeChanged() {
    // if (this.TrialBalanceForm.controls.ReportType.value === 'Sub Ledger') {
    const reportSubType = this.TrialBalanceForm.value.reportSubType;

    this.TrialBalanceForm.controls.subLedger.setValue("");
    this.TrialBalanceForm.controls.subLedgerHandler.setValue("");

    let responseFromAPI = [];
    switch (reportSubType) {
      case 'Location':
        responseFromAPI = await this.locationService.getLocations(
          { companyCode: this.storage.companyCode, activeFlag: true },
          { _id: 0, locCode: 1, locName: 1 })
        responseFromAPI = responseFromAPI.map(x => (
          { value: x.locCode, name: x.locName }));
        this.filter.Filter(this.jsonproftandlossArray, this.TrialBalanceForm, responseFromAPI, "subLedger", true);
        break;
      case 'Customer':
        responseFromAPI = await this.generalLedgerReportService.customersData()
        this.filter.Filter(this.jsonproftandlossArray, this.TrialBalanceForm, responseFromAPI, "subLedger", true);
        break;
      case 'Vendor':
        responseFromAPI = await this.generalLedgerReportService.vendorsData();
        this.filter.Filter(this.jsonproftandlossArray, this.TrialBalanceForm, responseFromAPI, "subLedger", true);
        break;
      case 'Employee':
        responseFromAPI = await this.generalLedgerReportService.usersData()
        this.filter.Filter(this.jsonproftandlossArray, this.TrialBalanceForm, responseFromAPI, "subLedger", true);
        break;
      case 'Driver':
        responseFromAPI = await this.generalLedgerReportService.driversData()
        this.filter.Filter(this.jsonproftandlossArray, this.TrialBalanceForm, responseFromAPI, "subLedger", true);
        break;
      case 'Vehicle':
        responseFromAPI = await this.generalLedgerReportService.vehicleData()
        this.filter.Filter(this.jsonproftandlossArray, this.TrialBalanceForm, responseFromAPI, "subLedger", true);
        break;
      default:

    }
    // } else {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Warning",
    //     text: `Select Report Type as Sub Ledger`,
    //     showConfirmButton: true,
    //   });
    //   this.TrialBalanceForm.controls["reportSubType"].setValue("");
    // }
  }
  //#endregion
  async save() {
    this.snackBarUtilityService.commonToast(async () => {
      try {

        const startDate = new Date(this.TrialBalanceForm.controls.start.value);
        const endDate = new Date(this.TrialBalanceForm.controls.end.value);
        const startdate = moment(startDate).startOf('day').toDate();
        const enddate = moment(endDate).endOf('day').toDate();

        let branch = [];
        if (this.TrialBalanceForm.value.Individual == "N") {
          branch = await this.generalLedgerReportService.GetReportingLocationsList(this.TrialBalanceForm.value.branch.value);
          branch.push(this.TrialBalanceForm.value.branch.value);
        } else {
          branch.push(this.TrialBalanceForm.value.branch.value);
        }
        this.reqBody = {
          startdate,
          enddate,
          branch,
          ReportType: this.TrialBalanceForm.value.ReportType.value,
          FinanceYear: this.TrialBalanceForm.value.Fyear.value,
          accountCode: this.TrialBalanceForm.value.accountHandler != '' ? this.TrialBalanceForm.value.accountHandler.map(x => x.value) : []

        }
        const Result: any[] = await this.accountReportService.GetTrialBalanceStatement(this.reqBody);
        const MatchFilter = {
          'D$match': {
            'aCCD': {
              'D$in': Result.map(x => x.AccountCode)
            },
            'bRCD': {
              'D$in': this.reqBody.branch
            }
          }
        }
        const OpeningBalanceResult: any[] = await this.accountReportService.GetOpeningBalance(this.reqBody, MatchFilter);
        Result.forEach(x => {
          if (x.AccountCode == OpeningBalanceResult.find(y => y.AccountCode == x.AccountCode)?.AccountCode) {
            x.OpeningDebit = parseFloat(OpeningBalanceResult.find(y => y.AccountCode == x.AccountCode)?.DebitAmount).toFixed(2);
            x.OpeningCredit = parseFloat(OpeningBalanceResult.find(y => y.AccountCode == x.AccountCode)?.CreditAmount).toFixed(2);
            x.ClosingDebit = (parseFloat(x.OpeningDebit) - parseFloat(x.TransactionDebit)).toFixed(2);
            x.ClosingCredit = (parseFloat(x.OpeningCredit) - parseFloat(x.TransactionCredit)).toFixed(2);
            x.BalanceAmount = (parseFloat(x.ClosingCredit) - parseFloat(x.ClosingDebit)).toFixed(2);
          }
        });
        Result.filter(item => item.MainCategory == "Total").forEach(x => {
          x.OpeningDebit = Result.filter(item => item.MainCategory == x.Category).reduce((total, item) => total + parseFloat(item.OpeningDebit), 0).toFixed(2);
          x.OpeningCredit = Result.filter(item => item.MainCategory == x.Category).reduce((total, item) => total + parseFloat(item.OpeningCredit), 0).toFixed(2);
          x.ClosingDebit = (parseFloat(x.OpeningDebit) - parseFloat(x.TransactionDebit)).toFixed(2);
          x.ClosingCredit = (parseFloat(x.OpeningCredit) - parseFloat(x.TransactionCredit)).toFixed(2);
          x.BalanceAmount = (parseFloat(x.ClosingCredit) - parseFloat(x.ClosingDebit)).toFixed(2);
        });

        const RequestData = {
          "Logo": this.storage.companyLogo,
          "Title": "TRIAL BALANCE STATEMENT",
          "Data": Result
        }
        this.accountReportService.setDataForTrialBalance("TrialBalanceData", RequestData);
        this.accountReportService.setDataForTrialBalance("TrialBalanceRequest", this.reqBody);
        window.open('/#/Reports/AccountReport/TrialBalanceview', '_blank');

        Swal.hideLoading();
        setTimeout(() => {
          Swal.close();
        }, 1000);
      } catch (error) {
        console.log(error)
        this.snackBarUtilityService.ShowCommonSwal(
          "error",
          "No Records Found"
        );
      }
    }, "Trial Balance Statement Is Generating Please Wait..!");
  }

  //#region to reset date range
  resetDateRange() {
    const selectedFinancialYear = this.TrialBalanceForm.controls.Fyear.value;
    const year = parseInt(selectedFinancialYear.value.slice(0, 2), 10) + 2000; // Get the full year from the financial year string
    const minDate = new Date(year, 3, 1);  // April 1 of the calculated year
    let maxDate = new Date(year + 1, 2, 31); // March 31 of the next year

    if (maxDate >= this.now) {
      maxDate = this.now;
    }

    this.TrialBalanceForm.controls["start"].setValue(minDate);
    this.TrialBalanceForm.controls["end"].setValue(maxDate);
  }
  //#endregion
}

const ReportType = [
  { value: "G", name: "Group Wise" },
  { value: "L", name: "Location Wise" },
  { value: "C", name: "Customer Wise" },
  { value: "V", name: "Vendor Wise" },
  { value: "E", name: "Employee Wise" },
  //{ value: "D", name: "Driver Wise" }
];