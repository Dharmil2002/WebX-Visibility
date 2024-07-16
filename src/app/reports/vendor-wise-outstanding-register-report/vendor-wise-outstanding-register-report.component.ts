import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { vendorWiseOutstandingRegister } from 'src/assets/FormControls/Reports/Vendor-Wise-Outstanding-Register/Vendor-Wise-Outstanding-Register';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { StorageService } from 'src/app/core/service/storage.service';
import { Subject, firstValueFrom, take, takeUntil } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import moment from 'moment';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { NavDataService } from 'src/app/core/service/navdata.service';
import { ReportService } from 'src/app/Utility/module/reports/generic-report.service';
import { ModuleCounterService } from 'src/app/core/service/Logger/module-counter-service.service';
@Component({
  selector: 'app-vendor-wise-outstanding-register-report',
  templateUrl: './vendor-wise-outstanding-register-report.component.html',
})
export class VendorWiseOutstandingRegisterReportComponent implements OnInit {

  breadScrums = [
    {
      title: "Vendor Outstanding Register Report",
      items: ["Report"],
      active: "Vendor Outstanding Register Report",
    },
  ];
  venNameDet: any;
  VendorOutstandingRegisterForm: UntypedFormGroup;
  jsonControlArray: any;
  loading = true
  columns = [];
  paging: any;
  sorting: any;
  columnMenu: any;
  searching: any;
  csvFileName: string;
  theme: "MATERIAL"
  protected _onDestroy = new Subject<void>();
  constructor(private fb: UntypedFormBuilder,
    private storage: StorageService,
    private masterServices: MasterService,
    private filter: FilterUtils,
    private locationService: LocationService,
    public snackBarUtilityService: SnackBarUtilityService,
    private nav: NavDataService,
    private reportService: ReportService,
    private MCountrService: ModuleCounterService
  ) { }

  ngOnInit(): void {
    this.initializeFormControl();
    const now = moment().endOf('day').toDate();
    this.VendorOutstandingRegisterForm.controls["start"].setValue(now);
    this.VendorOutstandingRegisterForm.controls["end"].setValue(now);
    this.getDropDownList();
    this.csvFileName = "VendorWiseOutstandingReport";

  }
  initializeFormControl() {
    const controls = new vendorWiseOutstandingRegister();
    this.jsonControlArray = controls.vendorOutstandingControlArray;
    this.VendorOutstandingRegisterForm = formGroupBuilder(this.fb, [this.jsonControlArray]);

  }

  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  async getDropDownList() {
    let venNameReq = {
      "companyCode": this.storage.companyCode,
      "filter": {},
      "collectionName": "vendor_detail"
    };
    const venNameRes = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", venNameReq));
    const venNameData = venNameRes?.data;
    const venNameDet = Array.isArray(venNameData) ?
      venNameData.map(element => ({
        name: element.vendorName.toString(),
        value: element.vendorCode.toString(),
      })) : [];
    this.venNameDet = venNameDet;
    this.filter.Filter(
      this.jsonControlArray,
      this.VendorOutstandingRegisterForm,
      venNameDet,
      "vennmcd",
      false
    );
    const branchList = await this.locationService.locationFromApi();
    this.filter.Filter(
      this.jsonControlArray,
      this.VendorOutstandingRegisterForm,
      branchList,
      "branch",
      false
    );
    const loginBranch = branchList.find(branch => branch.value === this.storage.branch);
    const selectedStatusData = branchList.filter((x) =>
      loginBranch.name.includes(x.name)
    );
    this.VendorOutstandingRegisterForm.controls['locHandler'].setValue(selectedStatusData);
    const statusList = [
      { name: "All", value: "All" },
      { name: "Pending", value: "2" },
      { name: "Partially ", value: "4" }
    ]
    this.filter.Filter(
      this.jsonControlArray,
      this.VendorOutstandingRegisterForm,
      statusList,
      "documnetstatus",
      false
    );
  }
  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonControlArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonControlArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.VendorOutstandingRegisterForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }
  async save() {
    this.loading = true;
    try {
      const startDate = new Date(this.VendorOutstandingRegisterForm.controls.start.value);
      const endDate = new Date(this.VendorOutstandingRegisterForm.controls.end.value);
      const startValue = moment(startDate).startOf('day').toDate();
      const endValue = moment(endDate).endOf('day').toDate();
      const Branch = Array.isArray(this.VendorOutstandingRegisterForm.value.locHandler)
        ? this.VendorOutstandingRegisterForm.value.locHandler.map(x => { return { locCD: x.value, locNm: x.name }; })
        : [];
      const DocStatus = this.VendorOutstandingRegisterForm.value.documnetstatus.value;
      const vendData = Array.isArray(this.VendorOutstandingRegisterForm.value.vendnmcdHandler)
        ? this.VendorOutstandingRegisterForm.value.vendnmcdHandler.map(x => { return { vCD: x.value, vNM: x.name }; })
        : [];
      const reqBody = {
        startValue, endValue, Branch, DocStatus, vendData
      };
      const result = await this.getVendorOustandingDetails(reqBody);
      this.columns = result.grid.columns;
      this.sorting = result.grid.sorting;
      this.searching = result.grid.searching;
      this.paging = result.grid.paging;

      // Push the module counter data to the server
      this.MCountrService.PushModuleCounter();
      const stateData = {
        data: result,
        formTitle: 'Vendor Outstanding Register Details',
        csvFileName: this.csvFileName
      };
      this.nav.setData(stateData);
      const url = `/#/Reports/generic-report-view`;
      window.open(url, '_blank');
    } catch (error) {
      this.snackBarUtilityService.ShowCommonSwal("error", error.message);
    }
  }
  async getVendorOustandingDetails(data) {
    const loc = data.Branch ? data.Branch.map(x => x.locCD) || [] : [];
    let matchQuery = {
      'D$and': [
        { bDT: { 'D$gte': data.startValue } },
        { bDT: { 'D$lte': data.endValue } },
        ...(data.vendData && data.vendData.length > 0
          ? [{ D$expr: { D$in: ["$vND.cD", data.vendData.map(v => v.vCD)] } }]
          : []),
        ...(loc.length > 0 ? [{ eNTLOC: { 'D$in': loc } }] : []),
        ...(data.DocStatus !== 'All' ? [{ bSTAT: { 'D$eq': data.DocStatus } }] : []),
        { bSTAT: { 'D$nin': [3, 7] } }
      ],
    };
    const res = await this.reportService.fetchReportData("VendorWiseOutstandingReport", matchQuery);
    const mapResponseValues = (item) => {
      if (item.dOCTYP === "Upload") {
        item.dOCTYP = "General";
      }
      if (["Awaiting Approval", "Approved"].includes(item.bSTATNM)) {
        item.bSTATNM = "Pending";
      }
      return item;
    };
    const mappedData = res.data.data.map(mapResponseValues);
    return {
      data: mappedData,
      grid: res.data.grid
    };
  }
}
