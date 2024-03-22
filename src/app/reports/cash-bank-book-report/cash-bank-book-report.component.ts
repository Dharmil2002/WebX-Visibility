import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { cashbankbookReport } from 'src/assets/FormControls/Reports/cash-bank-book-report/cash-bank-book-report';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import Swal from 'sweetalert2';
import { CashBankBookReportService } from 'src/app/Utility/module/reports/cash-bank-book-report-service';
import moment from 'moment';
import { exportAsExcelFile } from 'src/app/Utility/commonFunction/xlsxCommonFunction/xlsxCommonFunction';
import { timeString } from 'src/app/Utility/date/date-utils';
import { GeneralLedgerReportService } from 'src/app/Utility/module/reports/general-ledger-report.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { StorageService } from 'src/app/core/service/storage.service';
import { Subject, firstValueFrom, take, takeUntil } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
@Component({
  selector: 'app-cash-bank-book-report',
  templateUrl: './cash-bank-book-report.component.html'
})
export class CashBankBookReportComponent implements OnInit {

  breadScrums = [
    {
      title: "Cash-Bank Book Report ",
      items: ["Report"],
      active: "Cash-Bank Book Report ",
    },
  ];
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  protected _onDestroy = new Subject<void>();
  tableLoad = true;
  cashbankbookForm: UntypedFormGroup;
  jsoncashbankbookArray: any;
  cashbankbookFormControl: cashbankbookReport;
  branchName: any;
  branchStatus: any;
  ReportingBranches: string[] = [];
  report: string[] = [];
  accountName: any;
  accountStatus: any;
  allData: {
    accountNmData: any;
  };
  accDetailList: any;
  accNMDet: any;

  tableData: any[];
  reqBody: { startValue: Date; endValue: Date; accountCode: any; reportType: any; branch: string[]; startAmt: any; endAmt: any; Individual: any; };
  constructor(
    private fb: UntypedFormBuilder,
    public snackBarUtilityService: SnackBarUtilityService,
    private cashbankbookReportService: CashBankBookReportService,
    private generalLedgerReportService: GeneralLedgerReportService,
    private locationService: LocationService,
    private filter: FilterUtils,
    private storage: StorageService,
    private masterServices: MasterService
  ) {
    this.initializeFormControl();
  }
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  toggleArray = [];
  linkArray = [];
  DetailHeader = {
  }
  branch = {
    month: {
      id: 1,
      Title: "Month",
      class: "matcolumnleft",
      // Style: "max-width:200px",
      type: "Link",
      functionName: "downloadcsv"
    },
    openingBalance: {
      id: 2,
      Title: "Opening Balance",
      class: "matcolumnright"
    },
    dr: {
      id: 3,
      Title: "Debit",
      class: "matcolumnright"
    },
    cr: {
      id: 4,
      Title: "Credit",
      class: "matcolumnright"
    },
    bal: {
      id: 5,
      Title: "Balance",
      class: "matcolumnright"
    }
  }
  month = {
    month: {
      id: 1,
      Title: "Month",
      class: "matcolumnleft",
      // Style: "max-width:200px",
      type: "Link",
      functionName: "downloadcsv"
    },
    dr: {
      id: 3,
      Title: "Debit",
      class: "matcolumnright"
    },
    cr: {
      id: 4,
      Title: "Credit",
      class: "matcolumnright"
    },
    bal: {
      id: 5,
      Title: "Balance",
      class: "matcolumnright"
    }
  }
  staticField = [
    // "openbal",
    "dr",
    "cr",
    "bal",
    "openingBalance"
  ];
  DetCSVHeader = {
    "vDate": "Vr.Date",
    "transType": "Trans Type",
    "vno": "Vr.Number",
    "party": "Party",
    "legderAcc": "Ledger Account",
    "debit": "Debit",
    "credit": "Credit",
    "bal": "Balance",
    "refNo": "Reference No.",
    "doc": "Document",
    "nar": "Narration",
    "loc": "Location"
  }

  initializeFormControl() {
    this.cashbankbookFormControl = new cashbankbookReport();
    this.jsoncashbankbookArray = this.cashbankbookFormControl.cashbankbookControlArray;
    this.branchName = this.jsoncashbankbookArray.find(
      (data) => data.name === "branch"
    )?.name;
    this.branchStatus = this.jsoncashbankbookArray.find(
      (data) => data.name === "branch"
    )?.additionalData.showNameAndValue;
    this.accountName = this.jsoncashbankbookArray.find(
      (data) => data.name === "account"
    )?.name;
    this.accountStatus = this.jsoncashbankbookArray.find(
      (data) => data.name === "account"
    )?.additionalData.showNameAndValue;
    this.cashbankbookForm = formGroupBuilder(this.fb, [this.jsoncashbankbookArray]);
  }

  ngOnInit(): void {
    const now = moment().endOf('day').toDate();
    const lastweek = moment().add(-10, 'days').startOf('day').toDate()

    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.cashbankbookForm.controls["start"].setValue(lastweek);
    this.cashbankbookForm.controls["end"].setValue(now);
    this.getDropDownList();
  }

  async downloadcsv(data) {
    // Extract account codes from form values
    data.data['acCode'] = Array.isArray(this.cashbankbookForm.value.accountHandler)
      ? this.cashbankbookForm.value.accountHandler.map(x => x.value)
      : []
    const Amt = this.cashbankbookForm.controls.Amtrange.value.split("-") || 0;
    const startAmt = Amt[0];
    const endAmt = Amt[1];
    data.data['startAmt'] = startAmt;
    data.data['endAmt'] = endAmt;
    // Retrieve data from service;
    const res = await this.cashbankbookReportService.getCashBankBook(data);
    // Format debit and credit fields
    const formattedResults = res.map((x) => {
      x.debit = x.debit == 0 ? 0.00 : x.debit
      x.credit = x.credit == 0 ? 0.00 : x.credit
      return x
    });
    // Filter unnecessary fields
    const filteredRecordsWithoutKeys = formattedResults.map(({ rNO, dT, month, pMD, ...rest }) => rest);
    // Generate and download the CSV file
    exportAsExcelFile(filteredRecordsWithoutKeys, `Cash-Bank-Book_Report-${timeString}`, this.DetCSVHeader);
  }

  async getDropDownList() {
    // Fetch branch list from API
    const branchList = await this.locationService.locationFromApi();
    // Prepare request to fetch account details
    let accountReq = {
      "companyCode": this.storage.companyCode,
      "filter": {},
      "collectionName": "account_detail"
    };
    // Fetch account details from MongoDB
    const accountRes = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", accountReq));
    // Combine fetched data
    const mergedData = {
      accountNmData: accountRes?.data,
    };
    this.allData = mergedData;
    // Filter and sort account details by aCCD
    const accNMDet = mergedData.accountNmData
      .filter(element => element.gRPCD === "AST003")
      .map(element => ({
        name: element.aCNM,
        value: element.aCCD,
      })).sort((a, b) => a.value.localeCompare(b.value));
    // Filter and sort account details by aCCD
    this.accDetailList = accNMDet;
    this.accNMDet = accNMDet;
    // Apply filters
    this.filter.Filter(
      this.jsoncashbankbookArray,
      this.cashbankbookForm,
      accNMDet,
      this.accountName,
      this.accountStatus
    );
    this.filter.Filter(
      this.jsoncashbankbookArray,
      this.cashbankbookForm,
      branchList,
      this.branchName,
      this.branchStatus
    );
    const loginBranch = branchList.find(x => x.name === this.storage.branch);
    this.cashbankbookForm.controls["branch"].setValue(loginBranch);
    this.cashbankbookForm.get('Individual').setValue("Y");
    this.cashbankbookForm.get('report').setValue("D");
  }

  async save() {
    this.snackBarUtilityService.commonToast(async () => {
      try {
        const reportType = this.cashbankbookForm.controls.report.value;
        if (reportType == "B") {
          let DetailHeader = { ...this.branch }
          this.branch.month.Title = "Location"
          this.DetailHeader = DetailHeader
        }
        else {
          this.month.month.Title = "Month"
          this.DetailHeader = this.month
        }
        this.ReportingBranches = [];
        const branch = this.cashbankbookForm.value.branch.value;
        // Date range
        const startDate = new Date(this.cashbankbookForm.controls.start.value);
        const endDate = new Date(this.cashbankbookForm.controls.end.value);
        const startValue = moment(startDate).startOf('day').toDate();
        const endValue = moment(endDate).endOf('day').toDate();
        const Individual = this.cashbankbookForm.value.Individual

        // Amount Search Range
        const Amt = this.cashbankbookForm.controls.Amtrange.value.split("-") || 0;
        const startAmt = Amt[0];
        const endAmt = Amt[1];
        //  Check if endAmt is less than startAmt
        // if (endAmt < startAmt) {
        //   Swal.fire({
        //     icon: "error",
        //     title: "Invalid Amount Range",
        //     text: "End Amount cannot be less than Start Amount",
        //     showConfirmButton: true,
        //   });
        //   return; // Stop execution further
        // }

        const accountCode = Array.isArray(this.cashbankbookForm.value.accountHandler)
          ? this.cashbankbookForm.value.accountHandler.map(x => x.value)
          : [];

        this.reqBody = {
          startValue, endValue, accountCode, reportType, branch, startAmt, endAmt, Individual
        }

        const data = await this.cashbankbookReportService.getDetailCashBankBook(this.reqBody);

        if (!data || (Array.isArray(data) && data.length === 0)) {

          Swal.fire({
            icon: "error",
            title: "No Records Found",
            text: "Cannot Download CSV",
            showConfirmButton: true,
          });

          return;
        }
        Swal.hideLoading();
        setTimeout(() => {
          Swal.close();
        }, 1000);
        this.tableData = data
        this.tableLoad = false
      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal(
          "error",
          "No Records Found"
        );
      }
    }, "Cash-Bank Book Report Generating Please Wait..!");
  }

  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsoncashbankbookArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsoncashbankbookArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.cashbankbookForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
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
}
