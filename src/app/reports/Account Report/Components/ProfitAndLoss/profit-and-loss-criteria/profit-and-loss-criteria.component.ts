import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import Swal from 'sweetalert2';
import moment from 'moment';
import { GetLastFinYearEndDate, finYear, financialYear, timeString } from 'src/app/Utility/date/date-utils';
import { GeneralLedgerReportService } from 'src/app/Utility/module/reports/general-ledger-report.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { StorageService } from 'src/app/core/service/storage.service';
import { Subject, firstValueFrom, take, takeUntil } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { AccountReportService } from 'src/app/Utility/module/reports/accountreports';
import { ProfitAndLossReport } from '../../../../../../assets/FormControls/Reports/Account Reports/ProfitAndLossReport';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ModuleCounterService } from 'src/app/core/service/Logger/module-counter-service.service';
@Component({
  selector: 'app-profit-and-loss-criteria',
  templateUrl: './profit-and-loss-criteria.component.html'
})
export class ProfitAndLossCriteriaComponent implements OnInit {

  breadScrums = [
    {
      title: "Profit & Loss Statement",
      items: ["Report"],
      active: "Profit & Loss Statement",
    },
  ];
  ;
  proftandlossForm: UntypedFormGroup;
  jsonproftandlossArray: any;
  proftandlossFormControl: ProfitAndLossReport;
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

  tableData: any[];
  reqBody: {
    startdate: Date;
    enddate: Date;
    branch: string[];
    FinanceYear: any;
  };
  EndDate: any = moment().format("DD MMM YY");
  tableLoad = true;
  financYrName: any;
  financYrStatus: any;
  now = moment().endOf('day').toDate();
  lastweek = moment().add(-10, 'days').startOf('day').toDate();
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  DetailHeader = {
    MainCategory: {
      id: 1,
      Title: "Particulars",
      class: "matcolumnleft",
    },
    SubCategory: {
      id: 2,
      Title: "Description",
      class: "matcolumnleft"
    },
    Notes: {
      id: 3,
      Title: "Note No.",
      class: "matcolumnleft",
      type: "Link",
      functionName: "ViewNotes"
    },
    TotalAmountCurrentFinYear: {
      id: 4,
      Title: " Amount	As on" + this.EndDate,
      class: "matcolumncenter"
    },
    TotalAmountLastFinYear: {
      id: 5,
      Title: " Amount	As on " + GetLastFinYearEndDate(this.EndDate),
      class: "matcolumncenter"
    }
  }
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  staticField = [
    "MainCategory",
    "SubCategory",
    "TotalAmountCurrentFinYear",
    "TotalAmountLastFinYear"
  ];
  linkArray = [];

  constructor(
    private fb: UntypedFormBuilder,
    public snackBarUtilityService: SnackBarUtilityService,
    private accountReportService: AccountReportService,
    private generalLedgerReportService: GeneralLedgerReportService,
    private locationService: LocationService,
    private filter: FilterUtils,
    private router: Router,
    private storage: StorageService,
    private masterServices: MasterService,
    private MCountrService: ModuleCounterService
  ) {
    this.initializeFormControl();
  }
  initializeFormControl() {
    this.proftandlossFormControl = new ProfitAndLossReport();
    this.jsonproftandlossArray = this.proftandlossFormControl.ProfitAndLossControlArray;
    this.branchName = this.jsonproftandlossArray.find((data) => data.name === "branch")?.name;
    this.branchStatus = this.jsonproftandlossArray.find((data) => data.name === "branch")?.additionalData.showNameAndValue;

    // Retrieve and set details for the 'Fyear' control
    this.financYrName = this.getControlDetails("Fyear")?.name;
    this.financYrStatus = this.getControlDetails("Fyear")?.status;
    this.proftandlossForm = formGroupBuilder(this.fb, [this.jsonproftandlossArray]);
  }
  filterDropdown(name: string, status: any, dataList: any[]) {
    this.filter.Filter(this.jsonproftandlossArray, this.proftandlossForm, dataList, name, status);
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
    const lastYearAprilFirst = moment().subtract(1, 'year').startOf('year').month(3).date(1).toDate();
    this.proftandlossForm.controls["start"].setValue(lastYearAprilFirst);
    this.proftandlossForm.controls["end"].setValue(now);
    this.getDropDownList();
  }

  async getDropDownList() {
    const financialYearlist = this.generalLedgerReportService.getFinancialYear();
    const branchList = await this.locationService.locationFromApi();

    this.filter.Filter(
      this.jsonproftandlossArray,
      this.proftandlossForm,
      branchList,
      this.branchName,
      this.branchStatus
    );
    const loginBranch = branchList.find(x => x.value === this.storage.branch);
    this.filterDropdown(this.financYrName, this.financYrStatus, financialYearlist);
    this.proftandlossForm.controls["branch"].setValue(loginBranch);
    this.proftandlossForm.get('Individual').setValue("Y");
    // set Deafult Fin Year
    const selectedFinancialYear = financialYearlist.find(x => x.value === financialYear);
    this.proftandlossForm.controls["Fyear"].setValue(selectedFinancialYear);
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
    const startControlValue = this.proftandlossForm.controls.start.value;
    const endControlValue = this.proftandlossForm.controls.end.value;
    const selectedFinancialYear = this.proftandlossForm.controls.Fyear.value;

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
    this.proftandlossForm.controls["start"].setValue("");
    this.proftandlossForm.controls["end"].setValue("");
  }
  //#endregion
  async save() {
    this.snackBarUtilityService.commonToast(async () => {
      try {

        const startDate = new Date(this.proftandlossForm.controls.start.value);
        const endDate = new Date(this.proftandlossForm.controls.end.value);
        const startdate = moment(startDate).startOf('day').toDate();
        const enddate = moment(endDate).endOf('day').toDate();
        const FinanceYear = this.proftandlossForm.controls.Fyear.value.value;
        let branch = [];
        if (this.proftandlossForm.value.Individual == "N") {
          branch = await this.generalLedgerReportService.GetReportingLocationsList(this.proftandlossForm.value.branch.value);
          branch.push(this.proftandlossForm.value.branch.value);
        } else {
          branch.push(this.proftandlossForm.value.branch.value);
        }

        this.reqBody = {
          startdate, enddate, branch, FinanceYear,
        }
        this.EndDate = moment(endDate).format("DD MMM YY");

        const Result = await this.accountReportService.ProfitLossStatement(this.reqBody);
        if (Result.MainData == 0) {
          this.snackBarUtilityService.ShowCommonSwal(
            "error",
            "No Records Found"
          );
          return;
        }

        // Find Exceptional Items
        const exceptionalItems = Result.MainData.find(item => item && item.SubCategoryWithoutIndex === 'Exceptional Items');
        const extraordinaryItems = Result.MainData.find(item => item && item.SubCategoryWithoutIndex === 'Extraordinary items');

        let UpdatedData = Result.MainData.filter(item => {
          if (!item || typeof item.SubCategoryWithoutIndex === 'undefined') {
            return false;
          }
          return item.SubCategoryWithoutIndex !== 'Extraordinary items' && item.SubCategoryWithoutIndex !== 'Exceptional Items';
        });

        const TotalOfexceptionalItemsAndextraordinaryItems = parseFloat(exceptionalItems?.TotalAmountCurrentFinYear || 0) + parseFloat(extraordinaryItems?.TotalAmountCurrentFinYear || 0);
        UpdatedData.find(x => x.MainCategoryWithoutIndex === "EXPENSE").TotalAmountCurrentFinYear = (UpdatedData.find(x => x.MainCategoryWithoutIndex === "EXPENSE").TotalAmountCurrentFinYear - TotalOfexceptionalItemsAndextraordinaryItems).toFixed(2);
        // Push 3. Profit / [Loss] before Exceptional and Extraordinary items and Tax [1 - 2]
        const income = UpdatedData.find(x => x.MainCategoryWithoutIndex === "INCOME")?.TotalAmountCurrentFinYear ?? 0;
        const expense = UpdatedData.find(x => x.MainCategoryWithoutIndex === "Expense")?.TotalAmountCurrentFinYear ?? 0;
        const TotalProfitAndLoss = income - expense;


        const TotalAmountLastFinYear = 0;
        UpdatedData.push({
          "MainCategory": "3. Profit / [Loss] before Exceptional and Extraordinary items and Tax [1 - 2]",
          "SubCategory": "",
          "TotalAmountCurrentFinYear": TotalProfitAndLoss.toFixed(2),
          "TotalAmountLastFinYear": TotalAmountLastFinYear.toFixed(2),
          "Notes": ''
        });
        // Push 4. Exceptional Items 
        if (exceptionalItems) {
          UpdatedData.push({
            "MainCategory": "4. Exceptional Items",
            "SubCategory": "[4.1] Exceptional Items",
            "TotalAmountCurrentFinYear": exceptionalItems.TotalAmountCurrentFinYear,
            "TotalAmountLastFinYear": exceptionalItems.TotalAmountLastFinYear,
            "Notes": exceptionalItems.Notes,
            "AccountDetails": exceptionalItems.AccountDetails
          });
        }
        // Push 5. Profit / [Loss] before Extraordinary items and Tax [3+4]		 
        if (exceptionalItems) {
          UpdatedData.push({
            "MainCategory": "5. Profit / [Loss] before Extraordinary items and Tax [3-4]		",
            "SubCategory": "",
            "TotalAmountCurrentFinYear": (TotalProfitAndLoss - exceptionalItems.TotalAmountCurrentFinYear).toFixed(2),
            "TotalAmountLastFinYear": (TotalAmountLastFinYear - exceptionalItems.TotalAmountLastFinYear).toFixed(2),
            "Notes": ""
          });
        }
        // Push 6. Extraordinary items
        if (extraordinaryItems) {
          UpdatedData.push({
            "MainCategory": "6. Extraordinary items",
            "SubCategory": "[6.1] Extraordinary items",
            "TotalAmountCurrentFinYear": extraordinaryItems.TotalAmountCurrentFinYear,
            "TotalAmountLastFinYear": extraordinaryItems.TotalAmountLastFinYear,
            "Notes": extraordinaryItems.Notes,
            "AccountDetails": extraordinaryItems.AccountDetails
          });
        }
        // Push 7. Profit / (Loss) before tax [5 - 6]		
        if (extraordinaryItems) {
          UpdatedData.push({
            "MainCategory": "7. Profit / (Loss) before tax [5 - 6]",
            "SubCategory": "",
            "TotalAmountCurrentFinYear": ((TotalProfitAndLoss - exceptionalItems.TotalAmountCurrentFinYear) - extraordinaryItems.TotalAmountCurrentFinYear).toFixed(2),
            "TotalAmountLastFinYear": ((TotalAmountLastFinYear - exceptionalItems.TotalAmountLastFinYear) - extraordinaryItems.TotalAmountLastFinYear).toFixed(2),
            "Notes": ""
          });
        }
        if (Result.TaxDetails) {

          const TotalAmounts = Result.TaxDetails.reduce((acc, item) => {
            item.Details.forEach(detail => {
              acc.TotalCredit += detail.TotalCredit;
              acc.TotalDebit += detail.TotalDebit;
            });
            return acc;
          }, { TotalCredit: 0, TotalDebit: 0 });

          UpdatedData.push({
            "MainCategory": "8. Tax Expense",
            "SubCategory": "[8.1] Current Tax Expense for Current year",
            "TotalAmountCurrentFinYear": (TotalAmounts.TotalCredit - TotalAmounts.TotalDebit).toFixed(2),
            "TotalAmountLastFinYear": TotalAmountLastFinYear.toFixed(2),
            "Notes": ""
          });
          UpdatedData.push({
            "MainCategory": "",
            "SubCategory": "[8.2] Current Tax Expense for Related to Previous year",
            "TotalAmountCurrentFinYear": TotalAmountLastFinYear.toFixed(2),
            "TotalAmountLastFinYear": TotalAmountLastFinYear.toFixed(2),
            "Notes": ""
          });
          UpdatedData.push({
            "MainCategory": "",
            "SubCategory": "[8.3] Net current Tax Expense ",
            "TotalAmountCurrentFinYear": (TotalAmounts.TotalCredit - TotalAmounts.TotalDebit).toFixed(2),
            "TotalAmountLastFinYear": TotalAmountLastFinYear.toFixed(2),
            "Notes": ""
          });

          if (exceptionalItems && extraordinaryItems) {
            UpdatedData.push({
              "MainCategory": "9. Profit And loss for the year [7-8]",
              "SubCategory": "",
              "TotalAmountCurrentFinYear": (((TotalProfitAndLoss - exceptionalItems.TotalAmountCurrentFinYear) - extraordinaryItems.TotalAmountCurrentFinYear) - (TotalAmounts.TotalCredit - TotalAmounts.TotalDebit)).toFixed(2),
              "TotalAmountLastFinYear": TotalAmountLastFinYear.toFixed(2),
              "Notes": ""
            });
          }
        }


        const RequestData = {
          "CompanyIMG": this.storage.companyLogo,
          "finYear": finYear,
          "reportdate": "As on Date " + this.EndDate,
          "StartDate": moment(startDate).format("DD MMM YY"),
          "EndDate": this.EndDate,
          "Schedule": "Schedule III Compliant",
          "ProfitAndLossDetails": UpdatedData
        }
        this.MCountrService.PushModuleCounter();
        this.accountReportService.setData(RequestData);
        this.accountReportService.setRequestData(this.reqBody);
        window.open('/#/Reports/AccountReport/ProfitAndLossview', '_blank');


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
    }, "Profit & Loss Statement Is Generating Please Wait..!");
  }
  ViewNotes(data) {
    console.log(data?.data);
  }

  //#region to reset date range
  resetDateRange() {
    const selectedFinancialYear = this.proftandlossForm.controls.Fyear.value;
    const year = parseInt(selectedFinancialYear.value.slice(0, 2), 10) + 2000; // Get the full year from the financial year string
    const minDate = new Date(year, 3, 1);  // April 1 of the calculated year
    let maxDate = new Date(year + 1, 2, 31); // March 31 of the next year

    if (maxDate >= this.now) {
      maxDate = this.now;
    }

    this.proftandlossForm.controls["start"].setValue(minDate);
    this.proftandlossForm.controls["end"].setValue(maxDate);
  }
  //#endregion
}

