import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { FilterUtils } from 'src/app/Utility/Form Utilities/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { timeString } from 'src/app/Utility/date/date-utils';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { getLocationApiDetail } from 'src/app/finance/invoice-summary-bill/invoice-utility';
import { getShipment } from 'src/app/operation/thc-generation/thc-utlity';
import { jobQueryControl } from 'src/assets/FormControls/job-reports/job-query';

import { convertToCSV, getJobregisterReportDetail } from 'src/app/Utility/module/reports/job-register.service';

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

  CSVHeader = {
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

  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    private operationService: OperationService
  ) {
    this.initializeFormControl();
  }

  // Lifecycle hook called after Angular has initialized the component
  ngOnInit(): void {
    const now = new Date();
    const lastweek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 10
    );
    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    // this.jobQueryTableForm.controls["start"].setValue(lastweek);
    // this.jobQueryTableForm.controls["end"].setValue(now);
    this.jobQueryTableForm.controls["start"].setValue(lastweek);
    this.jobQueryTableForm.controls["end"].setValue(now);
    // Call a method to get dropdown list data
    this.getDropDownList();
  }

  async getDropDownList() {
    // Fetch location data from the API
    const locationList = await getLocationApiDetail(this.masterService);
    // Fetch job data from the API
    let dataJob = await getJobregisterReportDetail(this.masterService);
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

  async save() {
    let data = await getJobregisterReportDetail(this.masterService);
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
      // Check if job number is empty or matches the record's job number
      const jobDet = jobNo.length === 0 || jobNo.includes(record.jobNo);
      // Check if location is empty or matches the record's job location
      const locDet = Location.length === 0 || Location.includes(record.jobLocation);
      // Check if CNote number is empty or matches the record's CNote number
      const cnoteno = cNoteNum.length === 0 || cNoteNum.includes(record.cNoteNumber);

      // Convert and check if the record's entry time is within the specified date range
      const startValue = new Date(this.jobQueryTableForm.controls.start.value);
      const endValue = new Date(this.jobQueryTableForm.controls.end.value);
      const entryTime = new Date(record.ojobDate);
      const isDateRangeValid = entryTime >= startValue && entryTime <= endValue;

      // Return true if all conditions are met, indicating the record should be included in the result
      return jobDet && locDet && cnoteno && isDateRangeValid;
    });

    // Assuming you have your selected data in a variable called 'selectedData'
    const selectedData = filteredRecords;

    // Convert the selected data to a CSV string
    const csvString = convertToCSV(selectedData, ['ojobDate', 'jobLocation'], this.CSVHeader);

    // Create a Blob (Binary Large Object) from the CSV string
    const blob = new Blob([csvString], { type: 'text/csv' });

    // Create a link element
    const a = document.createElement('a');

    // Set the href attribute of the link to the Blob URL
    a.href = URL.createObjectURL(blob);

    // Set the download attribute with the desired file name
    a.download = `Job-Summary-Report-${timeString}.csv`;

    // Append the link to the body
    document.body.appendChild(a);

    // Trigger a click on the link to start the download
    a.click();

    // Remove the link from the body
    document.body.removeChild(a);
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