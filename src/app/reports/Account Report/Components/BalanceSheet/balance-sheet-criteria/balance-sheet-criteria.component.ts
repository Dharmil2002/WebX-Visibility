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
}

