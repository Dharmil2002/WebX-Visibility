import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { FilterUtils } from 'src/app/Utility/Form Utilities/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { timeString } from 'src/app/Utility/date/date-utils';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { getJobDetailFromApi } from 'src/app/dashboard/tabs/job-summary-page/job-summary-utlity';
import { getLocationApiDetail } from 'src/app/finance/invoice-summary-bill/invoice-utility';
import { getShipment } from 'src/app/operation/thc-generation/thc-utlity';

import { jobQueryControl } from 'src/assets/FormControls/job-reports/job-query';

@Component({
  selector: 'app-job-query-page',
  templateUrl: './job-query-page.component.html'
})
export class JobQueryPageComponent implements OnInit {
  /*Above all are used for the Job table*/
  jobQueryTableForm: UntypedFormGroup;
  jsonFormArray: any;
  protected _onDestroy = new Subject<void>();
  jobFormControls: jobQueryControl;
  breadScrums = [
    {
      title: "Job Register Report",
      items: ["Home"],
      active: "Job Register Report",
    },
  ];
  locationName: any;
  locationNameStatus: any;
  jobNoName: any;
  jobNoStatus: any;
  cnoteName: any;
  cnoteStatus: any;
  /*below the data which is for the report*/

  //#region 
  columnHeader = {
    jobNo: {
      Title: "Job No",
      class: "matcolumncenter",
      Style: "min-width:200px",
    },
    jobDate: {
      Title: "Job Date",
      class: "matcolumncenter",
      Style: "min-width:120px",
    },
    cNoteNumber: {
      Title: "Consignment Note Number",
      class: "matcolumncenter",
      Style: "min-width:190px",
    },
    cNoteDate: {
      Title: "Consignment Note Date",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    containerNumber: {
      Title: "Container Number",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    billingParty: {
      Title: "Billing Party",
      class: "matcolumncenter",
      Style: "min-width:180px",
    },
    bookingFrom: {
      Title: "Booking From",
      class: "matcolumncenter",
      Style: "min-width:145px",
    },
    toCity: {
      Title: "Destination",
      class: "matcolumncenter",
      Style: "min-width:130px",
    },
    pkgs: {
      Title: "Pkgs",
      class: "matcolumncenter",
      Style: "max-width:70px",
    },
    weight: {
      Title: "Gross Weight",
      class: "matcolumncenter",
      Style: "max-width:70px",
    },
    transportMode: {
      Title: "Job Mode",
      class: "matcolumncenter",
      Style: "max-width:70px",
    },
    noofcontainer: {
      Title: "No of 20 Ft Container",
      class: "matcolumncenter",
      Style: "min-width:150px",
    },
    noof40container: {
      Title: "No of 40 Ft Container",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    totalNoofcontainer: {
      Title: "Total No of Container ",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    jobType: {
      Title: "Job Type",
      class: "matcolumncenter",
      Style: "max-width:70px",
    },
    chargWt: {
      Title: "Charged Weight",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    DespatchQty: {
      Title: "Despatch Qty",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    despatchWt: {
      Title: "Despatched Weight",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    poNumber: {
      Title: "PO Number",
      class: "matcolumncenter",
      Style: "max-width:90px",
    },
    totalChaAmt: {
      Title: "CHA Amount",
      class: "matcolumncenter",
      Style: "max-width:90px",
    },
    voucherAmt: {
      Title: "Voucher Amount",
      class: "matcolumncenter",
      Style: "max-width:90px",
    },
    vendorBillAmt: {
      Title: "Vendor Bill Amount",
      class: "matcolumncenter",
      Style: "max-width:90px",
    },
    customerBillAmt: {
      Title: "Customer Bill Amount ",
      class: "matcolumncenter",
      Style: "max-width:90px",
    },
    status: {
      Title: "Current Status",
      class: "matcolumncenter",
      Style: "min-width:100px",
    },
    // fromToCity: {
    //   Title: "From-To City",
    //   class: "matcolumncenter",
    //   Style: "min-width:150px",
    // },
    // jobLocation: {
    //   Title: "Job Location",
    //   class: "matcolumncenter",
    //   Style: "max-width:90px",
    // },
    // vehicleSize: {
    //   Title: "Vehicle Size",
    //   class: "matcolumncenter",
    //   Style: "max-width:90px",
    // },

  };
  //#endregion

  //#region 
  staticField = [
    "jobNo",
    "jobDate",
    "cNoteNumber",
    "cNoteDate",
    "containerNumber",
    "billingParty",
    "bookingFrom",
    "toCity",
    "pkgs",
    "weight",
    "transportMode",
    "noofcontainer",
    "noof40container",
    "totalNoofcontainer",
    "jobType",
    "chargWt",
    "DespatchQty",
    "despatchWt",
    "poNumber",
    "totalChaAmt",
    "voucherAmt",
    "vendorBillAmt",
    "customerBillAmt",
    "status",
    // "fromToCity",
    // "jobLocation",
    // "vehicleSize",
  ];
  //#endregion

  addAndEditPath: string;
  linkArray = [];
  tableData: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  dynamicControls = {
    add: false,
    edit: true,
    csv: true,
  };
  headerForCsv = {
    "jobNo": "Job No",
    "jobDate": "Job Date",
    "jobType": "Job Type",
    "billingParty": "BillingParty",
    "fromToCity": "FromToCity",
  }
  csvFileName: string;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    private operationService: OperationService,
    private datePipe: DatePipe
  ) {
    this.initializeFormControl();
  }

  // Lifecycle hook called after Angular has initialized the component
  ngOnInit(): void {
    // Get the current date
    const now = new Date();
    // Calculate the date of the last week
    const lastweek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 10
    );
    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.jobQueryTableForm.controls["start"].setValue(lastweek);
    this.jobQueryTableForm.controls["end"].setValue(now);
     // Generate a CSV file name with a timestamp
    this.csvFileName = `Job-Summary-Reports-${timeString}.csv`;
      // Call a method to get dropdown list data
    this.getDropDownList();
  }

  async getDropDownList() {
     // Fetch location data from the API
    const locationList = await getLocationApiDetail(this.masterService);
     // Fetch job data from the API
    let dataJob = await getJobDetailFromApi(this.masterService);
     // Fetch shipment data from the API
    const shipmentList = await getShipment(this.operationService, false);
     // Map location data to a format suitable for dropdowns
    const locationDetail = locationList.map((x) => {
      return { value: x.locCode, name: x.locCode };
    });
    // Map job data to a format suitable for dropdowns
    const jobDetail = dataJob.map((x) => {
      return { value: x.jobNo, name: x.jobNo };
    });
    // Map shipment data to a format suitable for dropdowns
    const shipmentDetail = shipmentList.map((x) => {
      return { value: x.docketNumber, name: x.docketNumber };
    });
     // Apply dropdown data to filter the form controls
    this.filter.Filter(
      this.jsonFormArray,
      this.jobQueryTableForm,
      locationDetail,
      this.locationName,
      this.locationNameStatus
    );
    this.filter.Filter(
      this.jsonFormArray,
      this.jobQueryTableForm,
      jobDetail,
      this.jobNoName,
      this.jobNoStatus
    );
    this.filter.Filter(
      this.jsonFormArray,
      this.jobQueryTableForm,
      shipmentDetail,
      this.cnoteName,
      this.cnoteStatus
    );
  }

  initializeFormControl() {
    this.jobFormControls = new jobQueryControl();
    this.jsonFormArray = this.jobFormControls.jobControlArray;
    this.locationName = this.jsonFormArray.find(
      (data) => data.name === "locations"
    )?.name;
    this.locationNameStatus = this.jsonFormArray.find(
      (data) => data.name === "locations"
    )?.additionalData.showNameAndValue;
    this.jobNoName = this.jsonFormArray.find(
      (data) => data.name === "jobNo"
    )?.name;
    this.jobNoStatus = this.jsonFormArray.find(
      (data) => data.name === "jobNo"
    )?.additionalData.showNameAndValue;
    this.cnoteName = this.jsonFormArray.find(
      (data) => data.name === "cnote"
    )?.name;
    this.cnoteStatus = this.jsonFormArray.find(
      (data) => data.name === "cnote"
    )?.additionalData.showNameAndValue;
    this.jobQueryTableForm = formGroupBuilder(this.fb, [this.jsonFormArray]);
  }

  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;

    const index = this.jsonFormArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonFormArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.jobQueryTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }

  // Asynchronous method to filter and save job data based on user input
  async save() {
     // Fetch job data from the API
    let data = await getJobDetailFromApi(this.masterService);
// Extract selected values from form controls
    const Location = Array.isArray(this.jobQueryTableForm.value.LocationsHandler)
      ? this.jobQueryTableForm.value.LocationsHandler.map(x => x.value)
      : [];
    const jobNo = Array.isArray(this.jobQueryTableForm.value.jobNoHandler)
      ? this.jobQueryTableForm.value.jobNoHandler.map(x => x.name)
      : [];
    const cNoteNum = Array.isArray(this.jobQueryTableForm.value.cnoteHandler)
      ? this.jobQueryTableForm.value.cnoteHandler.map(x => x.name)
      : [];
// Filter records based on user-selected criteria
    const filteredRecords = data.filter(record => {
      const detail = jobNo.length === 0 || jobNo.includes(record.jobNo);
      const locDet = Location.length === 0 || Location.includes(record.jobLocation);
      const cnoteno = cNoteNum.length === 0 || cNoteNum.includes(record.cNoteNumber);
      const startDate = this.datePipe.transform(this.jobQueryTableForm.controls.start.value, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
      const endDate = this.datePipe.transform(this.jobQueryTableForm.controls.end.value, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
      const entryTime = record.ojobDate;
      const isDateRangeValid = startDate <= entryTime && entryTime < endDate;
      return detail && locDet && cnoteno && isDateRangeValid;
    });
    this.tableData = filteredRecords;
    this.tableLoad = false;
  }

  cancel() {
    this.router.navigate(["/Operation/JobEntry"]);
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
