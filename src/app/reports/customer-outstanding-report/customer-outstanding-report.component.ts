import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject, firstValueFrom, take, takeUntil } from 'rxjs';
import { timeString } from 'src/app/Utility/date/date-utils';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { CustOutstandingService, exportAsExcelFile } from 'src/app/Utility/module/reports/customer-outstanding-service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { custOutControl } from 'src/assets/FormControls/Reports/Customer-Outstanding-report/customer-outstanding-report';
// import { custOutControl } from 'src/assets/FormControls/Customer-Outstanding-report/customer-outstanding-report';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-outstanding-report',
  templateUrl: './customer-outstanding-report.component.html'
})
export class CustomerOutstandingReportComponent implements OnInit {
  breadScrums = [
    {
      title: "Customer Outstanding Register Report",
      items: ["Home"],
      active: "Customer Outstanding Register Report",
    },
  ];
  jsonCustOutFormArray: any
  CustOutTableForm: UntypedFormGroup
  custoutFormControl: custOutControl
  protected _onDestroy = new Subject<void>();
  locName: any;
  locStatus: any;
  custName: any;
  custStatus: any;
  custNameDet: any;
  customerDetailList: any;
  stateList: any;
  allData: {
    custNameData: any;
    stateData: any;
  };
  gstSTName: any;
  gstSTStatus: any;
  stateDet: any;
  selectedInvoiceType: string;
  constructor(
    private custOutstandingService: CustOutstandingService,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private locationService: LocationService,
    private storage: StorageService,
    private masterServices: MasterService,
  ) {
    this.initializeFormControl()
  }

  ngOnInit(): void {
    const now = new Date();
    const lastweek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 10
    );
    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.CustOutTableForm.controls["start"].setValue(lastweek);
    this.CustOutTableForm.controls["end"].setValue(now);
    this.getDropDownList()
  }

  CSVHeader = {
    "cust": "Customer",
    "loc":"Location",
    "openingBal": "Opening Balance",
    "billAmt": "Bill Amount",
    "unsubmittedAmt": "Un Submitted Amount",
    "submittedAmt": "Submitted Amount",
    "collectedAmt": "Collected Amount",
    "0-15": "0-15",
    "16-30": "16-30",
    "31-45": "31-45",
    "46-60": "46-60",
    "61-75": "61-75",
    "75-90": "75-90",
    "91-120": "91-120",
    "120-180": "120-180",
    "180-365": "180-365",
    "Above 365": "Above 365",
    "TotalPending": "Total Pending",
    "ManualVoucherAmount": "Manual Voucher Amount",
    "OnAccountBalance": "On Account Balance",
    "LedgerBalance": "Ledger Balance",
  }

  initializeFormControl() {
    this.custoutFormControl = new custOutControl();
    this.jsonCustOutFormArray = this.custoutFormControl.CustOutControlArray;
    this.locName = this.jsonCustOutFormArray.find(
      (data) => data.name === "loc"
    )?.name;
    this.locStatus = this.jsonCustOutFormArray.find(
      (data) => data.name === "loc"
    )?.additionalData.showNameAndValue;
    this.custName = this.jsonCustOutFormArray.find(
      (data) => data.name === "custnmcd"
    )?.name;
    this.custStatus = this.jsonCustOutFormArray.find(
      (data) => data.name === "custnmcd"
    )?.additionalData.showNameAndValue;

    this.gstSTName = this.jsonCustOutFormArray.find(
      (data) => data.name === "gststate"
    )?.name;
    this.gstSTStatus = this.jsonCustOutFormArray.find(
      (data) => data.name === "gststate"
    )?.additionalData.showNameAndValue;
    this.CustOutTableForm = formGroupBuilder(this.fb, [this.jsonCustOutFormArray]);
  }

  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonCustOutFormArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonCustOutFormArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.CustOutTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }

  // async getDropDownList() {
  //   const locationList = await this.locationService.getLocationList();
  //   // const StateList = await this.pinCodeService.getStateNestedData();
  //   let custNameReq = {
  //     "companyCode": this.storage.companyCode,
  //     "filter": {},
  //     "collectionName": "customer_detail"
  //   };
  //   let stateReq = {
  //     "companyCode": this.storage.companyCode,
  //     "filter": {},
  //     "collectionName": "state_master"
  //   };
  //   const custNameRes = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", custNameReq));
  //   const stateRes = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", stateReq));
  //   const mergedData = {
  //     custNameData: custNameRes?.data,
  //     stateData: stateRes?.data,
  //   };
  //   this.allData = mergedData;
  //   const custNameDet = mergedData.custNameData
  //     .map(element => ({
  //       name: element.customerName.toString(),
  //       value: element.customerCode.toString(),
  //     }));
  //   const stateDet = mergedData.stateData
  //     .map(element => ({
  //       name: element.STNM,
  //       value: element.ST,
  //     }));
  //   this.customerDetailList = custNameDet;
  //   this.stateList = stateDet;
  //   this.custNameDet = custNameDet;
  //   this.stateDet = stateDet;
  //   this.filter.Filter(
  //     this.jsonCustOutFormArray,
  //     this.CustOutTableForm,
  //     locationList,
  //     this.locName,
  //     this.locStatus
  //   );
  //   this.filter.Filter(
  //     this.jsonCustOutFormArray,
  //     this.CustOutTableForm,
  //     custNameDet,
  //     this.custName,
  //     this.custStatus
  //   );
  //   this.filter.Filter(
  //     this.jsonCustOutFormArray,
  //     this.CustOutTableForm,
  //     stateDet,
  //     this.gstSTName,
  //     this.gstSTStatus
  //   );
  // }

  async getDropDownList() {
    // Fetch location list
    const locationList = await this.locationService.getLocationList();
    // Prepare requests for customer names and state data
    const custNameReq = {
      companyCode: this.storage.companyCode,
      filter: {},
      collectionName: "customer_detail"
    };
    const stateReq = {
      companyCode: this.storage.companyCode,
      filter: {},
      collectionName: "state_master"
    };
    // Send requests concurrently and await their responses
    const custNameResPromise = this.masterServices.masterMongoPost("generic/get", custNameReq);
    const stateResPromise = this.masterServices.masterMongoPost("generic/get", stateReq);

    const custNameRes = await firstValueFrom(custNameResPromise);
    const stateRes = await firstValueFrom(stateResPromise);
    // Extract data from responses or set empty arrays if no data
    const custNameData = custNameRes?.data || [];
    const stateData = stateRes?.data || [];
    // Extract required details from customer names and state data
    const custNameDet = custNameData.map(({ customerName, customerCode }) => ({
      name: customerName.toString(),
      value: customerCode.toString(),
    }));

    const stateDet = stateData.map(({ STNM, ST }) => ({
      name: STNM,
      value: ST,
    }));
    // Store all data and derived details
    this.allData = { custNameData, stateData };
    this.customerDetailList = custNameDet;
    this.stateList = stateDet;
    this.custNameDet = custNameDet;
    this.stateDet = stateDet;

    // Filter and update UI
    this.filter.Filter(this.jsonCustOutFormArray, this.CustOutTableForm, locationList, this.locName, this.locStatus);
    this.filter.Filter(this.jsonCustOutFormArray, this.CustOutTableForm, custNameDet, this.custName, this.custStatus);
    this.filter.Filter(this.jsonCustOutFormArray, this.CustOutTableForm, stateDet, this.gstSTName, this.gstSTStatus);
  }

  async save() {
    const reportbasis = Array.isArray(this.CustOutTableForm.value.rptbasis)?'':this.CustOutTableForm.value.rptbasis;
    const startValue = new Date(this.CustOutTableForm.controls.start.value);
    const endValue = new Date(this.CustOutTableForm.controls.end.value);
    const loct = Array.isArray(this.CustOutTableForm.value.locHandler)
      ? this.CustOutTableForm.value.locHandler.map(x => { return { locCD: x.value, locNm: x.name }; })
      : [];
    const gstST = Array.isArray(this.CustOutTableForm.value.gstStHandler)
      ? this.CustOutTableForm.value.gstStHandler.map(x => { return { gstCD: x.value, gstNM: x.name }; })
      : [];
    const cust = Array.isArray(this.CustOutTableForm.value.custnmcdHandler)
      ? this.CustOutTableForm.value.custnmcdHandler.map(x => { return { custCD: x.value, custNm: x.name }; })
      : [];

    let data = await this.custOutstandingService.getcustomerOutstandingReportDetail(startValue, endValue, loct, cust, gstST, reportbasis);
    if (data.length === 0) {
      if (data) {
        Swal.fire({
          icon: "error",
          title: "No Records Found",
          text: "Cannot Download CSV",
          showConfirmButton: true,
        });
      }
      return;
    }
    exportAsExcelFile(data, `Customer_Outstanding_Report-${timeString}`, this.CSVHeader);
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
