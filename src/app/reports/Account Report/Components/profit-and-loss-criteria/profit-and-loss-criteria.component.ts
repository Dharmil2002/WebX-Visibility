import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import Swal from 'sweetalert2';
import moment from 'moment';
import { exportAsExcelFile } from 'src/app/Utility/commonFunction/xlsxCommonFunction/xlsxCommonFunction';
import { finYear, timeString } from 'src/app/Utility/date/date-utils';
import { GeneralLedgerReportService } from 'src/app/Utility/module/reports/general-ledger-report.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { StorageService } from 'src/app/core/service/storage.service';
import { Subject, firstValueFrom, take, takeUntil } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { AccountReportService } from 'src/app/Utility/module/reports/accountreports';
import { ProfitAndLossReport } from '../../../../../assets/FormControls/Reports/Account Reports/ProfitAndLossReport';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
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
  };
  EndDate: any = moment().format("DD MMM YY");
  tableLoad = true;
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
      Title: " Amount	As on 31 Mar 23",
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
    private masterServices: MasterService
  ) {
    this.initializeFormControl();
  }
  initializeFormControl() {
    this.proftandlossFormControl = new ProfitAndLossReport();
    this.jsonproftandlossArray = this.proftandlossFormControl.ProfitAndLossControlArray;
    this.branchName = this.jsonproftandlossArray.find(
      (data) => data.name === "branch"
    )?.name;
    this.branchStatus = this.jsonproftandlossArray.find(
      (data) => data.name === "branch"
    )?.additionalData.showNameAndValue;

    this.proftandlossForm = formGroupBuilder(this.fb, [this.jsonproftandlossArray]);
  }

  ngOnInit(): void {
    const now = moment().endOf('day').toDate();
    const lastYearAprilFirst = moment().subtract(1, 'year').startOf('year').month(3).date(1).toDate();
    this.proftandlossForm.controls["start"].setValue(lastYearAprilFirst);
    this.proftandlossForm.controls["end"].setValue(now);
    this.getDropDownList();
  }

  async getDropDownList() {
    const branchList = await this.locationService.locationFromApi();

    this.filter.Filter(
      this.jsonproftandlossArray,
      this.proftandlossForm,
      branchList,
      this.branchName,
      this.branchStatus
    );
    const loginBranch = branchList.find(x => x.name === this.storage.branch);
    this.proftandlossForm.controls["branch"].setValue(loginBranch);
    this.proftandlossForm.get('Individual').setValue("Y");
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

  async save() {
    this.snackBarUtilityService.commonToast(async () => {
      try {

        const startDate = new Date(this.proftandlossForm.controls.start.value);
        const endDate = new Date(this.proftandlossForm.controls.end.value);
        const startdate = moment(startDate).startOf('day').toDate();
        const enddate = moment(endDate).endOf('day').toDate();

        let branch = [];
        if (this.proftandlossForm.value.Individual == "N") {
          branch = await this.generalLedgerReportService.GetReportingLocationsList(this.proftandlossForm.value.branch.value);
          branch.push(this.proftandlossForm.value.branch.value);
        } else {
          branch.push(this.proftandlossForm.value.branch.value);
        }

        this.reqBody = {
          startdate, enddate, branch
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

        const UpdatedData = Result.MainData.filter(item => {
          if (!item || typeof item.SubCategoryWithoutIndex === 'undefined') {
            return false;
          }
          return item.SubCategoryWithoutIndex !== 'Extraordinary items' && item.SubCategoryWithoutIndex !== 'Exceptional Items';
        });

        // Push 3. Profit / [Loss] before Exceptional and Extraordinary items and Tax [1 - 2]
        const income = UpdatedData.find(x => x.MainCategoryWithoutIndex === "INCOME")?.TotalAmountCurrentFinYear ?? 0;
        const expense = UpdatedData.find(x => x.MainCategoryWithoutIndex === "Expense")?.TotalAmountCurrentFinYear ?? 0;
        const TotalProfitAndLoss = income - expense;


        const TotalAmountLastFinYear = 0;
        UpdatedData.push({
          "MainCategory": "3. Profit / [Loss] before Exceptional and Extraordinary items and Tax [1 - 2]",
          "SubCategory": "-",
          "TotalAmountCurrentFinYear": TotalProfitAndLoss.toFixed(2),
          "TotalAmountLastFinYear": TotalAmountLastFinYear.toFixed(2),
          "Notes": '-'
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
            "SubCategory": "-",
            "TotalAmountCurrentFinYear": (TotalProfitAndLoss - exceptionalItems.TotalAmountCurrentFinYear).toFixed(2),
            "TotalAmountLastFinYear": (TotalAmountLastFinYear - exceptionalItems.TotalAmountLastFinYear).toFixed(2),
            "Notes": "-"
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
            "SubCategory": "-",
            "TotalAmountCurrentFinYear": ((TotalProfitAndLoss - exceptionalItems.TotalAmountCurrentFinYear) - extraordinaryItems.TotalAmountCurrentFinYear).toFixed(2),
            "TotalAmountLastFinYear": ((TotalAmountLastFinYear - exceptionalItems.TotalAmountLastFinYear) - extraordinaryItems.TotalAmountLastFinYear).toFixed(2),
            "Notes": "-"
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

          UpdatedData.push({
            "MainCategory": "9. Profit And loss for the year [7-8]",
            "SubCategory": "-",
            "TotalAmountCurrentFinYear": (((TotalProfitAndLoss - exceptionalItems.TotalAmountCurrentFinYear) - extraordinaryItems.TotalAmountCurrentFinYear) - (TotalAmounts.TotalCredit - TotalAmounts.TotalDebit)).toFixed(2),
            "TotalAmountLastFinYear": TotalAmountLastFinYear.toFixed(2),
            "Notes": ""
          });
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
        this.accountReportService.setData(RequestData);
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
}

