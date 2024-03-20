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

        const data = await this.accountReportService.ProfitLossStatement(this.reqBody);
        if (data.length == 0) {
          this.snackBarUtilityService.ShowCommonSwal(
            "error",
            "No Records Found"
          );
          return;
        }

        // Push Others Data In data
        const income = data.find(x => x.MainCategoryWithoutIndex === "INCOME")?.TotalAmountCurrentFinYear ?? 0;
        const expense = data.find(x => x.MainCategoryWithoutIndex === "Expense")?.TotalAmountCurrentFinYear ?? 0;
        const TotalProfitAndLoss = income - expense;


        const TotalAmountLastFinYear = 0;
        data.push({
          "MainCategory": "3. Profit / [Loss] before Exceptional and Extraordinary items and Tax [1 - 2]",
          "SubCategory": "-",
          "TotalAmountCurrentFinYear": TotalProfitAndLoss.toFixed(2),
          "TotalAmountLastFinYear": TotalAmountLastFinYear.toFixed(2),
          "Notes": '-'
        });

        const RequestData = {
          "CompanyIMG": "https://webxblob.blob.core.windows.net/newtms/logo/webxpress-logo.png",
          "finYear": finYear,
          "reportdate": "As on Date " + this.EndDate,
          "StartDate": moment(startDate).format("DD MMM YY"),
          "EndDate": this.EndDate,
          "Schedule": "Schedule III Compliant",
          "ProfitAndLossDetails": data
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

