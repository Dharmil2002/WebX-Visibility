import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import moment from 'moment';
import { Subject, firstValueFrom, take, takeUntil } from 'rxjs';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { timeString } from 'src/app/Utility/date/date-utils';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { StateService } from 'src/app/Utility/module/masters/state/state.service';
import { VendorGSTInvoiceService } from 'src/app/Utility/module/reports/vendor-gst-invoice';
import { ModuleCounterService } from 'src/app/core/service/Logger/module-counter-service.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { vendorWiseGSTControl } from 'src/assets/FormControls/Vendor-Wise-GST-Register-Report/vendor-wise-gst-register';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendor-wise-gst-invoice-register',
  templateUrl: './vendor-wise-gst-invoice-register.component.html'
})
export class VendorWiseGstInvoiceRegisterComponent implements OnInit {

  allData: {
    venNameData: any;
    sacData: any
  };
  breadScrums = [
    {
      title: "Vendor Wise GST Invoice Register Report",
      items: ["Home"],
      active: "Vendor Wise GST Invoice Register Report",
    },
  ];
  vendorgstregisTableForm: UntypedFormGroup
  jsonvendgstregisFormArray: any
  vengstFormControls: vendorWiseGSTControl
  protected _onDestroy = new Subject<void>();
  vendorDetail: any;
  vendorDetailList: any;
  venNameDet: any;
  vendorName: any;
  vendorStatus: any;
  sacList: any;
  sacDet: any;
  sacName: any;
  sacStatus: any;
  stateName: any;
  stateStatus: any;
  formTitle = "Vendor Wise GST Invoice Register Data"
  csvFileName: string; // name of the csv file, when data is downloaded
  source: any[] = []; // Array to hold data
  loading = true // Loading indicator
  LoadTable = false;
  columns = [];

  paging: any;
  sorting: any;
  searching: any;
  columnMenu: any;
  theme: "MATERIAL"
  constructor(
    private storage: StorageService,
    private masterServices: MasterService,
    private filter: FilterUtils,
    private fb: UntypedFormBuilder,
    private vendorGSTInvoiceService: VendorGSTInvoiceService,
    private objStateService: StateService,
    private MCountrService: ModuleCounterService
  ) {
    this.initializeFormControl()
  }

  ngOnInit(): void {
    const now = moment().endOf('day').toDate();
    const lastweek = moment().add(-10, 'days').startOf('day').toDate()

    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.vendorgstregisTableForm.controls["start"].setValue(lastweek);
    this.vendorgstregisTableForm.controls["end"].setValue(now);
    this.getDropDownList()
    this.csvFileName = `Vendor_Wise_GST_Invoice_Register_Report-${timeString}`
  }

  initializeFormControl() {
    this.vengstFormControls = new vendorWiseGSTControl();
    this.jsonvendgstregisFormArray = this.vengstFormControls.vendorwisegstControlArray;
    this.vendorName = this.jsonvendgstregisFormArray.find(
      (data) => data.name === "vennmcd"
    )?.name;
    this.vendorStatus = this.jsonvendgstregisFormArray.find(
      (data) => data.name === "vennmcd"
    )?.additionalData.showNameAndValue;
    this.sacName = this.jsonvendgstregisFormArray.find(
      (data) => data.name === "saccd"
    )?.name;
    this.sacStatus = this.jsonvendgstregisFormArray.find(
      (data) => data.name === "saccd"
    )?.additionalData.showNameAndValue;
    this.stateName = this.jsonvendgstregisFormArray.find(
      (data) => data.name === "gststate"
    )?.name;
    this.stateStatus = this.jsonvendgstregisFormArray.find(
      (data) => data.name === "gststate"
    )?.additionalData.showNameAndValue;

    this.vendorgstregisTableForm = formGroupBuilder(this.fb, [this.jsonvendgstregisFormArray]);
  }

  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonvendgstregisFormArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonvendgstregisFormArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.vendorgstregisTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }

  async getDropDownList() {
    let venNameReq = {
      "companyCode": this.storage.companyCode,
      "filter": {},
      "collectionName": "vendor_detail"
    };
    let sacReq = {
      "companyCode": this.storage.companyCode,
      "filter": {},
      "collectionName": "sachsn_master"
    };
    const venNameRes = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", venNameReq));
    const sacRes = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", sacReq));
    const mergedData = {
      venNameData: venNameRes?.data,
      sacData: sacRes?.data
    };

    this.allData = mergedData;

    const venNameDet = mergedData.venNameData
      .map(element => ({
        name: element.vendorName.toString(),
        value: element.vendorCode.toString(),
        type: element.vendorType.toString(),
      }));
    const sacDet = mergedData.sacData
      .filter(element => element.SNM !== "" && element.SNM !== undefined && element.SNM !== null)
      .map(element => ({
        name: element.SNM,
        value: element.SID,
      }));

    this.vendorDetailList = venNameDet;
    this.sacList = sacDet;

    this.venNameDet = venNameDet;
    this.sacDet = sacDet;
    const statelist = await this.objStateService.getState();

    this.filter.Filter(
      this.jsonvendgstregisFormArray,
      this.vendorgstregisTableForm,
      venNameDet,
      this.vendorName,
      this.vendorStatus
    );
    this.filter.Filter(
      this.jsonvendgstregisFormArray,
      this.vendorgstregisTableForm,
      sacDet,
      this.sacName,
      this.sacStatus
    );

    this.filter.Filter(
      this.jsonvendgstregisFormArray,
      this.vendorgstregisTableForm,
      statelist,
      this.stateName,
      this.stateStatus
    );

  }

  //#region to apply filters and download excel file
  async save() {

    // Extract values from the form
    const startDate = new Date(this.vendorgstregisTableForm.controls.start.value);
    const endDate = new Date(this.vendorgstregisTableForm.controls.end.value);

    const startValue = moment(startDate).startOf('day').toDate();
    const endValue = moment(endDate).endOf('day').toDate();

    const docummentNo = this.vendorgstregisTableForm.value.docNo;
    const cancelBill = this.vendorgstregisTableForm.value.cannon || [];

    // Check if a comma is present in docNo
    const docNoArray = docummentNo.includes(',') ? docummentNo.split(',') : [docummentNo];

    const vendrnm = Array.isArray(this.vendorgstregisTableForm.value.vennmcdHandler)
      ? this.vendorgstregisTableForm.value.vennmcdHandler.map(x => { return { vCD: x.value, vNM: x.name }; })
      : [];
    // Extract saccdHandler, gststateHandler values
    const sacData = Array.isArray(this.vendorgstregisTableForm.value.saccdHandler)
      ? this.vendorgstregisTableForm.value.saccdHandler.map(x => parseInt(x.value))
      : [];

    const stateData = Array.isArray(this.vendorgstregisTableForm.value.gststateHandler)
      ? this.vendorgstregisTableForm.value.gststateHandler.map(x => parseInt(x.value))
      : [];

    const reqBody = { startValue, endValue, sacData, vendrnm, cancelBill, stateData }
    try {

      // Get data from the service
      const data = await this.vendorGSTInvoiceService.getvendorGstRegisterReportDetail(reqBody, docNoArray);

      this.columns = data.grid.columns;
      this.sorting = data.grid.sorting;
      this.searching = data.grid.searching;
      this.paging = data.grid.paging;
      this.source = data.data;
      this.LoadTable = true;

      if (data.data.length === 0) {
        this.LoadTable = false;
        this.loading = false;
        // Display a message or take appropriate action when no records are found
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
      this.loading = false;
      // Push the module counter data to the server
      this.MCountrService.PushModuleCounter();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  //#endregion

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