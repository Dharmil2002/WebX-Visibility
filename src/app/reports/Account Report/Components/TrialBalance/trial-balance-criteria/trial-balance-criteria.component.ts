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
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TrialBalanceReport } from 'src/assets/FormControls/Reports/Account Reports/TrialBalanceReport';
@Component({
  selector: 'app-trial-balance-criteria',
  templateUrl: './trial-balance-criteria.component.html'
})
export class TrialBalanceCriteriaComponent implements OnInit {

  breadScrums = [
    {
      title: "Trial Balance Report",
      items: ["Report"],
      active: "Trial Balance Report",
    },
  ];
  ;
  TrialBalanceForm: UntypedFormGroup;
  jsonproftandlossArray: any;
  TrialBalanceFormControl: TrialBalanceReport;
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
  };
  EndDate: any = moment().format("DD MMM YY");
  financYrName: any;
  financYrStatus: any;


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
    const loginBranch = branchList.find(x => x.name === this.storage.branch);
    this.TrialBalanceForm.controls["branch"].setValue(loginBranch);
    this.TrialBalanceForm.get('Individual').setValue("Y");
    const financialYearlist = this.generalLedgerReportService.getFinancialYear();
    const accountList = await this.generalLedgerReportService.getAccountDetail();
    this.filterDropdown(this.financYrName, this.financYrStatus, financialYearlist);
    this.filterDropdown(this.accountName, this.accountStatus, accountList);
    this.filterDropdown("ReportType", false, [
      {
        value: "G",
        name: "Group Wise",
      },
      {
        value: "L",
        name: "Location Wise",
      },
      {
        value: "C",
        name: "Customer Wise",
      },
      {
        value: "V",
        name: "Vendor Wise",
      },
      {
        value: "E",
        name: "Employee Wise",
      },
      {
        value: "D",
        name: "Driver Wise",
      },

    ]);


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
          startdate, enddate, branch, ReportType: this.TrialBalanceForm.value.ReportType.value, FinanceYear: this.TrialBalanceForm.value.Fyear.value

        }
        this.EndDate = moment(endDate).format("DD MMM YY");

        const Result = await this.accountReportService.GetTrialBalanceStatement(this.reqBody);
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
        this.snackBarUtilityService.ShowCommonSwal(
          "error",
          "No Records Found"
        );
      }
    }, "Trial Balance Statement Is Generating Please Wait..!");
  }

}

