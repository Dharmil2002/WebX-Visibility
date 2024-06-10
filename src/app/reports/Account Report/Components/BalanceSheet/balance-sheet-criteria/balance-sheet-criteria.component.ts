import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import Swal from 'sweetalert2';
import moment from 'moment';
import { GeneralLedgerReportService } from 'src/app/Utility/module/reports/general-ledger-report.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { StorageService } from 'src/app/core/service/storage.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { AccountReportService } from 'src/app/Utility/module/reports/accountreports';
import { Router } from '@angular/router';
import { BalanceSheetReport } from 'src/assets/FormControls/Reports/Account Reports/BalanceSheetReport';
@Component({
  selector: 'app-balance-sheet-criteria',
  templateUrl: './balance-sheet-criteria.component.html'
})
export class BalanceSheetCriteriaComponent implements OnInit {

  breadScrums = [
    {
      title: "Balance Sheet Statement",
      items: ["Report"],
      active: "Balance Sheet Statement",
    },
  ];
  ;
  BalanceSheetForm: UntypedFormGroup;
  jsonBalanceSheetArray: any;
  BalanceSheetFormControl: BalanceSheetReport;
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
    startdate: Date;
    enddate: Date;
    branch: string[];
    FinanceYear: string;
    DateType: string;
  };
  EndDate: any = moment().format("DD MMM YY");
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
    this.BalanceSheetFormControl = new BalanceSheetReport();
    this.jsonBalanceSheetArray = this.BalanceSheetFormControl.BalanceSheetControlArray;
    this.branchName = this.jsonBalanceSheetArray.find(
      (data) => data.name === "branch"
    )?.name;
    this.branchStatus = this.jsonBalanceSheetArray.find(
      (data) => data.name === "branch"
    )?.additionalData.showNameAndValue;

    this.BalanceSheetForm = formGroupBuilder(this.fb, [this.jsonBalanceSheetArray]);
  }

  ngOnInit(): void {
    const now = moment().endOf('day').toDate();
    const lastYearAprilFirst = moment().subtract(1, 'year').startOf('year').month(3).date(1).toDate();
    this.BalanceSheetForm.controls["start"].setValue(lastYearAprilFirst);
    this.BalanceSheetForm.controls["end"].setValue(now);
    this.getDropDownList();
  }

  async getDropDownList() {
    const branchList = await this.locationService.locationFromApi();

    this.filter.Filter(
      this.jsonBalanceSheetArray,
      this.BalanceSheetForm,
      branchList,
      this.branchName,
      this.branchStatus
    );
    const loginBranch = branchList.find(x => x.value === this.storage.branch);
    this.BalanceSheetForm.controls["branch"].setValue(loginBranch);
    this.BalanceSheetForm.get('Individual').setValue("Y");

    const DateTypeList = [
      {
        name: "Posting Date", value: "vDT"
      },
      { name: "Entry Date", value: "eNTDT" }
    ]
    this.filter.Filter(
      this.jsonBalanceSheetArray,
      this.BalanceSheetForm,
      DateTypeList,
      "dateType",
      false
    );
    this.BalanceSheetForm.get('dateType').setValue(DateTypeList[0]);

    const financialYearlist = this.generalLedgerReportService.getFinancialYear();
    this.filter.Filter(
      this.jsonBalanceSheetArray,
      this.BalanceSheetForm,
      financialYearlist,
      "Fyear",
      false
    );
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
  //#region to validate date range according to financial year
  validateDateRange(event): void {

    // Get the values from the form controls
    const startControlValue = this.BalanceSheetForm.controls.start.value;
    const endControlValue = this.BalanceSheetForm.controls.end.value;
    const selectedFinancialYear = this.BalanceSheetForm.controls.Fyear.value;

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
    this.BalanceSheetForm.controls["start"].setValue("");
    this.BalanceSheetForm.controls["end"].setValue("");
  }
  //#endregion
  async save() {
    this.snackBarUtilityService.commonToast(async () => {
      try {

        const startDate = new Date(this.BalanceSheetForm.controls.start.value);
        const endDate = new Date(this.BalanceSheetForm.controls.end.value);
        const startdate = moment(startDate).startOf('day').toDate();
        const enddate = moment(endDate).endOf('day').toDate();

        let branch = [];
        if (this.BalanceSheetForm.value.Individual == "N") {
          branch = await this.generalLedgerReportService.GetReportingLocationsList(this.BalanceSheetForm.value.branch.value);
          branch.push(this.BalanceSheetForm.value.branch.value);
        } else {
          branch.push(this.BalanceSheetForm.value.branch.value);
        }

        this.reqBody = {
          startdate,
          enddate,
          branch,
          FinanceYear: this.BalanceSheetForm.value.Fyear.value,
          DateType: this.BalanceSheetForm.value.dateType.value

        }
        this.EndDate = moment(endDate).format("DD MMM YY");

        const Result = await this.accountReportService.GetBalanceSheet(this.reqBody);
        if (Result.length == 0) {
          this.snackBarUtilityService.ShowCommonSwal(
            "error",
            "No Records Found"
          );
          return;
        }
        const RequestData = {
          "CompanyIMG": this.storage.companyLogo,
          "finYear": this.reqBody.FinanceYear,
          "reportdate": "As on Date " + this.EndDate,
          "StartDate": moment(startDate).format("DD MMM YY"),
          "EndDate": this.EndDate,
          "Schedule": "Schedule III Compliant",
          "BalanceSheetDetails": Result
        }
        this.accountReportService.setDataForTrialBalance("BalanceSheet", RequestData);
        window.open('/#/Reports/AccountReport/BalanceSheetview', '_blank');



        Swal.hideLoading();
        setTimeout(() => {
          Swal.close();
        }, 1000);
      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal(
          "error",
          "No Records Found"
        );
      }
    }, "Balance Sheet Statement Is Generating Please Wait..!");
  }
  //#region to reset date range
  resetDateRange() {
    const selectedFinancialYear = this.BalanceSheetForm.controls.Fyear.value;
    const year = parseInt(selectedFinancialYear.value.slice(0, 2), 10) + 2000; // Get the full year from the financial year string
    const minDate = new Date(year, 3, 1);  // April 1 of the calculated year
    let maxDate = new Date(year + 1, 2, 31); // March 31 of the next year

    if (maxDate >= this.now) {
      maxDate = this.now;
    }

    this.BalanceSheetForm.controls["start"].setValue(minDate);
    this.BalanceSheetForm.controls["end"].setValue(maxDate);
  }
  //#endregion
}

