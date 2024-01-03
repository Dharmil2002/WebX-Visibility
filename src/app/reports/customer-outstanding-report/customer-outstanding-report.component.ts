import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject, firstValueFrom, take, takeUntil } from 'rxjs';
import { timeString } from 'src/app/Utility/date/date-utils';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { CustOutstandingService, convertToCSV } from 'src/app/Utility/module/reports/customer-outstanding-service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { custOutControl } from 'src/assets/FormControls/Customer-Outstanding-report/customer-outstanding-report';
import Swal from 'sweetalert2';
import { log } from 'util';

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
  allData: {
    custNameData: any;
  };
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
    "custCode": "Customer Code",
    "cust": "Customer",
    "openingBal": "Opening Balance",
    "billAmt": "Bill Amount",
    "unsubmittedAmt": "Un Submitted Amount",
    "submittedAmt": "Submitted Amount",
    "collectionAmt": "Collection Amount",
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

  async getDropDownList() {
    const locationList = await this.locationService.getLocationList();
    let custNameReq = {
      "companyCode": this.storage.companyCode,
      "filter": {},
      "collectionName": "customer_detail"
    };
    const custNameRes = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", custNameReq));
    const mergedData = {
      custNameData: custNameRes?.data,
    };
    this.allData = mergedData;
    const custNameDet = mergedData.custNameData
      .map(element => ({
        name: element.customerName.toString(),
        value: element.customerCode.toString(),
      }));
    this.customerDetailList = custNameDet;
    this.custNameDet = custNameDet;
    this.filter.Filter(
      this.jsonCustOutFormArray,
      this.CustOutTableForm,
      locationList,
      this.locName,
      this.locStatus
    );
    this.filter.Filter(
      this.jsonCustOutFormArray,
      this.CustOutTableForm,
      custNameDet,
      this.custName,
      this.custStatus
    );
  }

  async save() {
    let data = await this.custOutstandingService.getcustomerOutstandingReportDetail()
    const loct = Array.isArray(this.CustOutTableForm.value.locHandler)
      ? this.CustOutTableForm.value.locHandler.map(x => x.value)
      : [];
    const cust = Array.isArray(this.CustOutTableForm.value.custnmcdHandler)
      ? this.CustOutTableForm.value.custnmcdHandler.map(x => x.name)
      : [];
    const filteredRecords = data.filter(record => {
      const locDet = loct.length === 0 || loct.includes(record.oloc);
      const custDet = cust.length === 0 || cust.includes(record.cust);
      const startValue = new Date(this.CustOutTableForm.controls.start.value);
      const endValue = new Date(this.CustOutTableForm.controls.end.value);
      const entryTime = new Date(record.obGNDT);
      endValue.setHours(23, 59, 59, 999);
      const isDateRangeValid = entryTime >= startValue && entryTime <= endValue;

      return isDateRangeValid && locDet && custDet;
    });
    // const selectedData = filteredRecords;
    if (filteredRecords.length === 0) {
      // Display a message or take appropriate action when no records are found
      if (filteredRecords) {
        Swal.fire({
          icon: "error",
          title: "No Records Found",
          text: "Cannot Download CSV",
          showConfirmButton: true,
        });
      }
      return;
    }
    // Convert the selected data to a CSV string
    const csvString = convertToCSV(filteredRecords, this.CSVHeader);
    // Create a Blob (Binary Large Object) from the CSV string
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    // Create a link element
    const a = document.createElement('a');
    // Set the href attribute of the link to the Blob URL
    a.href = URL.createObjectURL(blob);
    // Set the download attribute with the desired file name
    a.download = `Customer_Outstanding_Report-${timeString}.csv`;
    // Append the link to the body
    document.body.appendChild(a);
    // Trigger a click on the link to start the download
    a.click();
    // Remove the link from the body
    document.body.removeChild(a);
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
