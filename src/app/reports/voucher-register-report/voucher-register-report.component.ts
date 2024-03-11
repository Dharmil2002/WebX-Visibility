import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { vouchRegControl } from 'src/assets/FormControls/Reports/VoucherRegister/voucherregister';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { StorageService } from 'src/app/core/service/storage.service';
import { firstValueFrom } from 'rxjs';
import { voucherRegService } from 'src/app/Utility/module/reports/voucherRegister.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { timeString } from 'src/app/Utility/date/date-utils';
import Swal from 'sweetalert2';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { GeneralLedgerReportService } from 'src/app/Utility/module/reports/general-ledger-report.service';
import { Subject, take, takeUntil } from 'rxjs';
import { exportAsExcelFile } from 'src/app/Utility/commonFunction/xlsxCommonFunction/xlsxCommonFunction';
import moment from 'moment';
@Component({
  selector: 'app-voucher-register-report',
  templateUrl: './voucher-register-report.component.html'
})
export class VoucherRegisterReportComponent implements OnInit {

  voucherRegTableForm: UntypedFormGroup;
  jsonvoucherRegFormArray: any;
  vouchRegFormControls: vouchRegControl;
  breadScrums = [
    {
      title: "Voucher Register Report",
      items: ["Home"],
      active: "Voucher Register Report",
    },
  ];
  vouchNM: any;
  vouchStatus: any;
  transNM: any;
  transStatus: any;
  partyTPNM: any;
  partyTPStatus: any;
  partyNM: any;
  partyStatus: any;
  allData: {
    Data: any
  };
  vouNMList: any;
  VoucherNmDet: any;
  TranTPList: any;
  tranTPDet: any;
  partyTPList: any;
  partyTPDet: any;
  partyNMList: any;
  partyNMDet: any;
  branchStatus: any;
  branchName: any;
  ReportingBranches: string[] = [];
  protected _onDestroy = new Subject<void>();
  constructor(
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterServices: MasterService,
    private storage: StorageService,
    private voucherregService: voucherRegService,
    private locationService: LocationService,
    public snackBarUtilityService: SnackBarUtilityService,
    private generalLedgerReportService: GeneralLedgerReportService
  ) {
    this.initializeFormControl();
  }

  CSVHeader = {
    "vNO": "Voucher No",
    "vDt": "Voucher Date",
    "vTp": "Voucher Type",
    "accLoc": "Account Loc",
    "accCdDes": "Account Code : Description",
    "DA": "Debit Amt(₹)",
    "CA": "Credit Amt(₹)",
    "Narr": "Narration",
    "PT": "Party Type",
    "PCN": "Party Code - Name",
    "TT": "Transaction Type",
    "DocNo": "Document No",
    "CUNo": "Cheque/ UTR No",
    "CUDate": "Cheque/ UTR Date",
    "EB": "Entry By",
    "EDT": "Entry Date Time",
    "EL": "Entry Location",
    "vamount": "voucherAmt(₹)"
  }

  ngOnInit(): void {
    const now = new Date();
    const lastweek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 10
    );
    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.voucherRegTableForm.controls["start"].setValue(lastweek);
    this.voucherRegTableForm.controls["end"].setValue(now);
    this.getDropDownList();
    this.getDropDownList();
  }

  initializeFormControl() {
    this.vouchRegFormControls = new vouchRegControl();
    this.jsonvoucherRegFormArray = this.vouchRegFormControls.vouchRegControlArray;
    this.branchName = this.jsonvoucherRegFormArray.find(
      (data) => data.name === "branch"
    )?.name;
    this.branchStatus = this.jsonvoucherRegFormArray.find(
      (data) => data.name === "branch"
    )?.additionalData.showNameAndValue;
    this.vouchNM = this.jsonvoucherRegFormArray.find(
      (data) => data.name === "vouchTp"
    )?.name;
    this.vouchStatus = this.jsonvoucherRegFormArray.find(
      (data) => data.name === "vouchTp"
    )?.additionalData.showNameAndValue;
    this.transNM = this.jsonvoucherRegFormArray.find(
      (data) => data.name === "transTp"
    )?.name;
    this.transStatus = this.jsonvoucherRegFormArray.find(
      (data) => data.name === "vouchTp"
    )?.additionalData.showNameAndValue;
    this.partyTPNM = this.jsonvoucherRegFormArray.find(
      (data) => data.name === "partyTp"
    )?.name;
    this.partyTPStatus = this.jsonvoucherRegFormArray.find(
      (data) => data.name === "partyTp"
    )?.additionalData.showNameAndValue;
    this.partyNM = this.jsonvoucherRegFormArray.find(
      (data) => data.name === "partyNm"
    )?.name;
    this.partyStatus = this.jsonvoucherRegFormArray.find(
      (data) => data.name === "partyNm"
    )?.additionalData.showNameAndValue;
    this.voucherRegTableForm = formGroupBuilder(this.fb, [this.jsonvoucherRegFormArray]);
  }

  async getDropDownList() {
    const branchList = await this.locationService.locationFromApi();
    let voucherReq = {
      "companyCode": this.storage.companyCode,
      "filter": {},
      "collectionName": "voucher_trans"
    };
    const vouchRes = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", voucherReq));
    const mergedData = {
      Data: vouchRes?.data,
    };
    this.allData = mergedData;
    const voucherDet = mergedData.Data
      .map(element => ({
        name: element.vTYPNM,
        value: element.vTYP,
      }))
      .filter(item => item.name !== undefined && item.value !== undefined)
      .sort((a, b) => a.value - b.value);
    const TranTPDet = mergedData.Data
      .map(element => ({
        name: element.tTYPNM,
        value: element.tTYP,
      }))
      .filter(element => element.name !== 'CNoteBooking') 
      .sort((a, b) => a.value - b.value);
    const partyTPDet = mergedData.Data
      .map(element => ({
        name: element.pRE,
        value: element.pRE,
      }))
      .filter(item =>
        typeof item.name === 'string' &&
        typeof item.value === 'string' &&
        item.name.trim() !== '' &&
        item.value.trim() !== ''
      );
    const partyNMDet = mergedData.Data
      .map(element => ({
        name: element.pNAME,
        value: element.pCODE,
      }))
      .filter(item =>
        typeof item.name === 'string' &&
        typeof item.value === 'string' &&
        item.name.trim() !== '' &&
        item.value.trim() !== ''
      );

    const uniquevouchNM = Array.from(new Set(voucherDet.map(a => a.value)))
      .map(value => {
        return voucherDet.find(a => a.value === value);
      });
    const uniqueTranTP = Array.from(new Set(TranTPDet.map(a => a.value)))
      .map(value => {
        return TranTPDet.find(a => a.value === value);
      });
    const uniquepartyTP = Array.from(new Set(partyTPDet.map(a => a.value)))
      .map(value => {
        return partyTPDet.find(a => a.value === value);
      });
    const uniquepartyNM = Array.from(new Set(partyNMDet.map(a => a.value)))
      .map(value => {
        return partyNMDet.find(a => a.value === value);
      });

    this.vouNMList = uniquevouchNM;
    this.VoucherNmDet = uniquevouchNM;
    this.TranTPList = uniqueTranTP;
    this.tranTPDet = uniqueTranTP;
    this.partyTPList = uniquepartyTP;
    this.partyTPDet = uniquepartyTP;
    this.partyNMList = uniquepartyNM;
    this.partyNMDet = uniquepartyNM;

    this.filter.Filter(
      this.jsonvoucherRegFormArray,
      this.voucherRegTableForm,
      uniquevouchNM,
      this.vouchNM,
      this.vouchStatus
    );
    this.filter.Filter(
      this.jsonvoucherRegFormArray,
      this.voucherRegTableForm,
      uniqueTranTP,
      this.transNM,
      this.transStatus
    );
    this.filter.Filter(
      this.jsonvoucherRegFormArray,
      this.voucherRegTableForm,
      uniquepartyTP,
      this.partyTPNM,
      this.partyTPStatus
    );
    this.filter.Filter(
      this.jsonvoucherRegFormArray,
      this.voucherRegTableForm,
      uniquepartyNM,
      this.partyNM,
      this.partyStatus
    );
    this.filter.Filter(
      this.jsonvoucherRegFormArray,
      this.voucherRegTableForm,
      branchList,
      this.branchName,
      this.branchStatus
    );
    const loginBranch = branchList.find(x => x.name === this.storage.branch);
    this.voucherRegTableForm.controls["branch"].setValue(loginBranch);
    this.voucherRegTableForm.get('Individual').setValue("Y");
  }

  async save() {
    this.snackBarUtilityService.commonToast(async () => {
      try {
        this.ReportingBranches = [];
        if (this.voucherRegTableForm.value.Individual == "N") {
          this.ReportingBranches = await this.generalLedgerReportService.GetReportingLocationsList(this.voucherRegTableForm.value.branch.name);
          this.ReportingBranches.push(this.voucherRegTableForm.value.branch.name);
        } else {
          this.ReportingBranches.push(this.voucherRegTableForm.value.branch.name);
        }
        const cheqNo = this.voucherRegTableForm.value.cheq;
        const vouchamt = this.voucherRegTableForm.value.vAmt;

        const startValue = new Date(this.voucherRegTableForm.controls.start.value);
        const endValue = new Date(this.voucherRegTableForm.controls.end.value);
        const startDate = moment(startValue).startOf('day').toDate();
        const endDate = moment(endValue).endOf('day').toDate();

        const docNo = this.voucherRegTableForm.value.docNo;
        const docNoArray = docNo.includes(',') ? docNo.split(',') : [docNo];

        const voucherNo = this.voucherRegTableForm.value.vNo;
        const vNoArray = voucherNo.includes(',') ? voucherNo.split(',') : [voucherNo];

        const voucherTpData = Array.isArray(this.voucherRegTableForm.value.vouchtpHandler)
          ? this.voucherRegTableForm.value.vouchtpHandler.map(x => x.value)
          : [];
        const tranTpData = Array.isArray(this.voucherRegTableForm.value.transtpHandler)
          ? this.voucherRegTableForm.value.transtpHandler.map(x => x.value)
          : [];
        const partyTpData = Array.isArray(this.voucherRegTableForm.value.partytpHandler)
          ? this.voucherRegTableForm.value.partytpHandler.map(x => x.value)
          : [];
        const partyNmData = Array.isArray(this.voucherRegTableForm.value.partynmHandler)
          ? this.voucherRegTableForm.value.partynmHandler.map(x => x.value)
          : [];
        const branch = this.ReportingBranches;
        const individual = this.voucherRegTableForm.value.Individual;
        const reqBody = {
          individual, branch, startDate, endDate, vNoArray, voucherTpData, tranTpData, partyTpData, partyNmData,
          docNoArray, cheqNo, vouchamt
        }
        const data = await this.voucherregService.getvoucherRegReportDetail(reqBody);
        const csv = data.map((x) => {
          x.DA = x.DA == 0 ? "0.00" : x.DA
          x.CA = x.CA == 0 ? "0.00" : x.CA
          x.vamount = x.vamount == 0 ? "0.00" : x.vamount
          return x
        })
        if (csv.length === 0) {
          if (csv) {
            Swal.fire({
              icon: "error",
              title: "No Records Found",
              text: "Cannot Download CSV",
              showConfirmButton: true,
            });
          }
          return;
        }
        Swal.hideLoading();
        setTimeout(() => {
          Swal.close();
        }, 1000);
        exportAsExcelFile(csv, `Voucher-Register_Report-${timeString}`, this.CSVHeader);
      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal(
          "error",
          error.message
        );
      }
    }, "Voucher Register Report Generating Please Wait..!");
  }

  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonvoucherRegFormArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonvoucherRegFormArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.voucherRegTableForm.controls[autocompleteSupport].patchValue(
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
