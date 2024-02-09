import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, take, firstValueFrom, takeUntil } from 'rxjs';
import { FilterUtils } from 'src/app/Utility/Form Utilities/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { timeString } from 'src/app/Utility/date/date-utils';
import { JobRegisterService, convertToCSV, exportAsExcelFile } from 'src/app/Utility/module/reports/job-register.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { getJobDetailFromApi } from 'src/app/dashboard/tabs/job-summary-page/job-summary-utlity';
import { getLocationApiDetail } from 'src/app/finance/invoice-summary-bill/invoice-utility';
import { getShipment } from 'src/app/operation/thc-generation/thc-utlity';
import { jobQueryControl } from 'src/assets/FormControls/Reports/job-reports/job-query';

// import { jobQueryControl } from 'src/assets/FormControls/job-reports/job-query';
import Swal from 'sweetalert2';

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
  allColumnFilter: any;
  filterColumn: boolean = true;
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
      Style: "min-width:350px",
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
    noof20ftStd: {
      Title: "No of 20 ft Standard",
      class: "matcolumncenter",
      Style: "min-width:150px",
    },
    noof40ftStd: {
      Title: "No of 40 ft Standard",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    noof40ftHC: {
      Title: "No of 40 ft High Cube",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    noof45ftHC: {
      Title: "No of 45 ft High Cube",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    noof20ftRf: {
      Title: "No of 20 ft Reefer",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    noof40ftRf: {
      Title: "No of 40 ft Reefer",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    noof40ftHCR: {
      Title: "No of 40 ft High Cube Reefer",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    noof20ftOT: {
      Title: "No of 20 ft Open Top",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    noof40ftOT: {
      Title: "No of 40 ft Open Top",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    noof20ftFR: {
      Title: "No of 20 ft Flat Rack",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    noof40ftFR: {
      Title: "No of 40 ft Flat Rack",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    noof20ftPf: {
      Title: "No of 20 ft Platform",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    noof40ftPf: {
      Title: "No of 40 ft Platform",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    noof20ftTk: {
      Title: "No of 20 ft Tank",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    noof20ftSO: {
      Title: "No of 20 ft Side Open",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    noof40ftSO: {
      Title: "No of 40 ft Side Open",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    noof20ftI: {
      Title: "No of 20 ft Insulated",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    noof20ftH: {
      Title: "No of 20 ft Hardtop",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    noof40ftH: {
      Title: "No of 40 ft Hardtop",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    noof20ftV: {
      Title: "No of 20 ft Ventilated",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    noof20ftT: {
      Title: "No of 20 ft Tunnel",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    noof40ftT: {
      Title: "No of 40 ft Tunnel",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    noofBul: {
      Title: "No of Bulktainers",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    noofSB: {
      Title: "No of Swap Bodies",
      class: "matcolumncenter",
      Style: "max-width:150px",
    },
    totalNoofcontainer: {
      Title: "Total No of Container",
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
      Title: "Customer Bill Amount",
      class: "matcolumncenter",
      Style: "max-width:90px",
    },
    status: {
      Title: "Current Status",
      class: "matcolumncenter",
      Style: "min-width:100px",
    },
  };
  //#endregion

  //#region 
  staticField = [
    "noof20ftRf",
    "noof20ftStd",
    "noof40ftStd",
    "noof40ftHC",
    "noof45ftHC",
    "noof40ftRf",
    "noof40ftHCR",
    "noof20ftOT",
    "noof40ftOT",
    "noof20ftFR",
    "noof40ftFR",
    "noof20ftPf",
    "noof40ftPf",
    "noof20ftTk",
    "noof20ftSO",
    "noof40ftSO",
    "noof20ftI",
    "noof20ftH",
    "noof40ftH",
    "noof20ftV",
    "noof20ftT",
    "noof40ftT",
    "noofBul",
    "noofSB",
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
    "cNoteNumber": "Consignment Note Number",
    "cNoteDate": "Consignment Note Date",
    "containerNumber": "Container Number",
    "billingParty": "Billing Party",
    "bookingFrom": "Booking From",
    "toCity": "Destination",
    "pkgs": "Pkgs",
    "weight": "Gross Weight",
    "transportMode": "Job Mode",
    "jobType": "Job Type",
    "chargWt": "Charged Weight",
    "DespatchQty": "Despatch Qty",
    "despatchWt": "Despatched Weight",
    "poNumber": "PO Number",
    "totalChaAmt": "CHA Amount",
    "voucherAmt": "Voucher Amount",
    "vendorBillAmt": "Vendor Bill Amount",
    "customerBillAmt": "Customer Bill Amount",
    "status": "Current Status",
    "noof20ftRf": "Swap Bodies",
    "noof40ftRf": "40 ft Reefer",
    "noof40ftHCR": "40 ft High Cube Reefer",
    "noof20ftOT": "20 ft Open Top",
    "noof40ftOT": "40 ft Open Top",
    "noof20ftFR": "20 ft Flat Rack",
    "noof40ftFR": "40 ft Flat Rack",
    "noof20ftPf": "20 ft Platform",
    "noof40ftPf": "40 ft Platform",
    "noof20ftTk": "20 ft Tank",
    "noof20ftSO": "20 ft Side Open",
    "noof40ftSO": "40 ft Side Open",
    "noof20ftI": "20 ft Insulated",
    "noof20ftH": "20 ft Hardtop",
    "noof40ftH": "40 ft Hardtop",
    "noof20ftV": "20 ft Ventilated",
    "noof20ftT": "20 ft Tunnel",
    "noof40ftT": "40 ft Tunnel",
    "noofBul": "Bulktainers",
    "noofSB": "Swap Bodies",
    "noof20ftStd": "20 ft Standard",
    "noof40ftStd": "40 ft Standard",
    "noof40ftHC": "40 ft High Cube",
    "noof45ftHC": "45 ft High Cube",
    "totalNoofcontainer": "Total No of Container",
  }
  csvFileName: string;

  // CSVHeader = {
  //   "jobNo": "Job No",
  //   "jobDate": "Job Date",
  //   "cNoteNumber": "Consignment Note Number",
  //   "cNoteDate": "Consignment Note Date",
  //   "containerNumber": "Container Number",
  //   "billingParty": "Billing Party",
  //   "bookingFrom": "Booking From",
  //   "toCity": "Destination",
  //   "pkgs": "Pkgs",
  //   "weight": "Gross Weight",
  //   "transportMode": "Job Mode",
  //   "jobType": "Job Type",
  //   "chargWt": "Charged Weight",
  //   "DespatchQty": "Despatch Qty",
  //   "despatchWt": "Despatched Weight",
  //   "poNumber": "PO Number",
  //   "totalChaAmt": "CHA Amount",
  //   "voucherAmt": "Voucher Amount",
  //   "vendorBillAmt": "Vendor Bill Amount",
  //   "customerBillAmt": "Customer Bill Amount",
  //   "status": "Current Status",
  //   "noof20ftRf": "Swap Bodies",
  //   "noof40ftRf": "40 ft Reefer",
  //   "noof40ftHCR": "40 ft High Cube Reefer",
  //   "noof20ftOT": "20 ft Open Top",
  //   "noof40ftOT": "40 ft Open Top",
  //   "noof20ftFR": "20 ft Flat Rack",
  //   "noof40ftFR": "40 ft Flat Rack",
  //   "noof20ftPf": "20 ft Platform",
  //   "noof40ftPf": "40 ft Platform",
  //   "noof20ftTk": "20 ft Tank",
  //   "noof20ftSO": "20 ft Side Open",
  //   "noof40ftSO": "40 ft Side Open",
  //   "noof20ftI": "20 ft Insulated",
  //   "noof20ftH": "20 ft Hardtop",
  //   "noof40ftH": "40 ft Hardtop",
  //   "noof20ftV": "20 ft Ventilated",
  //   "noof20ftT": "20 ft Tunnel",
  //   "noof40ftT": "40 ft Tunnel",
  //   "noofBul": "Bulktainers",
  //   "noofSB": "Swap Bodies",
  //   "noof20ftStd": "20 ft Standard",
  //   "noof40ftStd": "40 ft Standard",
  //   "noof40ftHC": "40 ft High Cube",
  //   "noof45ftHC": "45 ft High Cube",
  //   "totalNoofcontainer": "Total No of Container",
  // }

  CSVHeader = {
    "jobNo": "Job Number",
    "jobDate": "Job Date",
    "cNoteNumber": "Consignment Note Number",
    "cNoteDate": "Consignment Note Date",
    "containerNumber": "Container Number",
    "billingParty": "Party Name",
    "bookingFrom": "Booking From",
    "toCity": "Destination",
    "pkgs": "Pkgs",
    "weight": "Gross Weight",
    "jobMode": "Job Mode",
    "jobType": "Job Type",
    "chargWt": "Charged Weight",
    "DespatchQty": "Despatch Qty",
    "despatchWt": "Despatched Weight",
    "poNumber": "PO Number",
    "totalChaAmt": "CHA Amount",
    "voucherAmt": "Voucher Amount",
    "vendorBillAmt": "Vendor Bill Amount",
    "customerBillAmt": "Customer Bill Amount",
    "status": "Current Status",
    "noof20ftRf": "Swap Bodies",
    "noof40ftRf": "40 ft Reefer",
    "noof40ftHCR": "40 ft High Cube Reefer",
    "noof20ftOT": "20 ft Open Top",
    "noof40ftOT": "40 ft Open Top",
    "noof20ftFR": "20 ft Flat Rack",
    "noof40ftFR": "40 ft Flat Rack",
    "noof20ftPf": "20 ft Platform",
    "noof40ftPf": "40 ft Platform",
    "noof20ftTk": "20 ft Tank",
    "noof20ftSO": "20 ft Side Open",
    "noof40ftSO": "40 ft Side Open",
    "noof20ftI": "20 ft Insulated",
    "noof20ftH": "20 ft Hardtop",
    "noof40ftH": "40 ft Hardtop",
    "noof20ftV": "20 ft Ventilated",
    "noof20ftT": "20 ft Tunnel",
    "noof40ftT": "40 ft Tunnel",
    "noofBul": "Bulktainers",
    "noofSB": "Swap Bodies",
    "noof20ftStd": "20 ft Standard",
    "noof40ftStd": "40 ft Standard",
    "noof40ftHC": "40 ft High Cube",
    "noof45ftHC": "45 ft High Cube",
    "totalNoofcontainer": "Total No of Container",
  }

  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    private operationService: OperationService,
    private storage: StorageService,
    private jobRegisterService: JobRegisterService
  ) {
    this.initializeFormControl();
    this.allColumnFilter = this.columnHeader;
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
    // let dataJob = await getJobregisterReportDetail(this.masterService);
    let jobReq = {
      "companyCode": this.storage.companyCode,
      "filter": {},
      "collectionName": "job_details"
    };
    const jobRes = await firstValueFrom(this.masterService.masterMongoPost("generic/get", jobReq));
    const mergedData = {
      jobData: jobRes?.data
    };
    // Fetch shipment data from the API
    const shipmentList = await getShipment(this.operationService, false);
    // Map location data to a format suitable for dropdowns
    const locationDetail = locationList.map((x) => {
      return { value: x.locCode, name: x.locName };
    });
    // Map job data to a format suitable for dropdowns
    const jobDetail = mergedData.jobData.map(element => ({
      name: element.jID,
      value: element.jID,
    }));
    // const jobDetail = dataJob.map((x) => {
    //   return { value: x.jobNo, name: x.jobNo };
    // });
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

  async save() {
    const startValue = new Date(this.jobQueryTableForm.controls.start.value);
    const endValue = new Date(this.jobQueryTableForm.controls.end.value);
    let data = await this.jobRegisterService.getJobregisterReportDetail(startValue,endValue);
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
      const jobDet = jobNo.length === 0 || jobNo.includes(record.jobNo);
      const locDet = Location.length === 0 || Location.includes(record.jobLocation);
      const cnoteno = cNoteNum.length === 0 || cNoteNum.includes(record.cNoteNumber);

      // Return true if all conditions are met, indicating the record should be included in the result
      return jobDet && locDet && cnoteno;
    });
    // Assuming you have your selected data in a variable called 'selectedData'
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
    const filteredRecordsWithoutKeys = filteredRecords.map((record) => {
      const { jobLocation, ...rest } = record;
      return rest;
    });
    exportAsExcelFile(filteredRecordsWithoutKeys, `Job-Summary-Report-${timeString}`, this.CSVHeader);
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