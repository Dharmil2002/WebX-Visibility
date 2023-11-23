import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject, take, takeUntil } from 'rxjs';
import { FilterUtils } from 'src/app/Utility/Form Utilities/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import {timeString } from 'src/app/Utility/date/date-utils';
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
  
  columnHeader = {
    jobNo: {
      Title: "Job No",
      class: "matcolumnleft",
      Style: "min-width:250px",
    },
    jobDate: {
      Title: "Job Date",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
    jobType: {
      Title: "Job Type",
      class: "matcolumnleft",
      Style:  "max-width:70px",
    },
    billingParty: {
      Title: "Billing Party",
      class: "matcolumnleft",
      Style: "min-width:180px",
    },
    fromToCity: {
      Title: "From-To City",
      class: "matcolumnleft",
      Style: "min-width:150px",
    },
    jobLocation: {
      Title: "Job Location",
      class: "matcolumnleft",
      Style: "max-width:90px",
    },
    pkgs: {
      Title: "Pkgs",
      class: "matcolumncenter",
      Style: "max-width:70px",
    },
    vehicleSize: {
      Title: "Vehicle Size",
      class: "matcolumncenter",
      Style:  "max-width:90px",
    },
    status: {
      Title: "Status",
      class: "matcolumnleft",
      Style: "min-width:100px",
    }
  };
  //#endregion
  staticField = [
    "jobNo",
    "jobDate",
    "jobType",
    "billingParty",
    "fromToCity",
    "jobLocation",
    "pkgs",
    "vehicleSize",
    "status"
  ];
  /*End*/
  addAndEditPath: string;
  linkArray = [];
  tableData: any[];
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  dynamicControls = {
    add: true,
    edit: true,
    csv: true,
  };
  headerForCsv = {
    // "srNo": "Sr No.",
    "jobNo": "Job No",
    "jobDate": "Job Date",
    "jobType": "Job Type",
    "billingParty": "BillingParty",
    "fromToCity": "FromToCity",
  }
  csvFileName:string;
  constructor(
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService,
    private operationService: OperationService,
    private datePipe: DatePipe
  ) {
    this.initializeFormControl();
  }

  ngOnInit(): void {
    const now = new Date();
    const lastweek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 10
    );
    // Set default start and end dates when the component initializes
    this.jobQueryTableForm.controls["start"].setValue(lastweek);
    this.jobQueryTableForm.controls["end"].setValue(now);
    this.csvFileName = `Job-Summary-Reports-${timeString}.csv`;
    this.getDropDownList();
  }
  async getDropDownList() {
    const locationList = await getLocationApiDetail(this.masterService);
    let dataJob = await getJobDetailFromApi(this.masterService);
    const shipmentList = await getShipment(this.operationService, false);
    const locationDetail = locationList.map((x) => {
      return { value: x.locCode, name: x.locCode };
    });
    const jobDetail = dataJob.map((x) => {
      return { value: x.jobNo, name: x.jobNo };
    });
    const shipmentDetail = shipmentList.map((x) => {
      return { value: x.docketNumber, name: x.docketNumber };
    });
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
    // Get form controls for job Entry form section
    this.jsonFormArray = this.jobFormControls.jobControlArray;
    // Build the form group using formGroupBuilder function
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
    let data = await getJobDetailFromApi(this.masterService);
    const Locations = Array.isArray(this.jobQueryTableForm.value.LocationsHandler)
    ? this.jobQueryTableForm.value.LocationsHandler.map(x => x.value)
    : [];
  const jobNo = Array.isArray(this.jobQueryTableForm.value.jobNoHandler)
    ? this.jobQueryTableForm.value.jobNoHandler.map(x => x.name)
    : [];
    const filteredRecords = data.filter(record => {
      const startDate = this.datePipe.transform(this.jobQueryTableForm.controls.start.value, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
      const endDate = this.datePipe.transform(this.jobQueryTableForm.controls.end.value, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
      const entryTime = new Date(record.entryDate);
      const isJob = !jobNo||jobNo.some(jobNo => jobNo == record.jobNo);
      console.log(isJob);
      const isDateRangeValid = startDate <= entryTime.toISOString() && entryTime.toISOString() < endDate;
      return isDateRangeValid && isJob;
    });
    this.tableData = filteredRecords;
    this.tableLoad = false;
  }
}
