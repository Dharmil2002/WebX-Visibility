import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { volumetricShipmentRegisterControl } from 'src/assets/FormControls/Reports/volumetric-shipment-report/volumetric-shipment-register-report';
import { Subject, take, takeUntil } from 'rxjs';
import { CustomerService } from 'src/app/Utility/module/masters/customer/customer.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { GeneralLedgerReportService } from 'src/app/Utility/module/reports/general-ledger-report.service';
import { VolumetricShipmentReportService } from 'src/app/Utility/module/reports/volumetric-shipment-register.service';
import moment from 'moment';
import Swal from 'sweetalert2';
import { timeString } from 'src/app/Utility/date/date-utils';
import { ExportService } from 'src/app/Utility/module/export.service';
import { ModuleCounterService } from 'src/app/core/service/Logger/module-counter-service.service';

@Component({
  selector: 'app-volumetric-shipment-register',
  templateUrl: './volumetric-shipment-register.component.html'
})
export class VolumetricShipmentRegisterComponent implements OnInit {

  breadScrums = [
    {
      title: "Volumetric Shipment Report",
      items: ["Home"],
      active: "Volumetric Shipment Report",
    },
  ];
  volumetricShipRegisterTableForm: UntypedFormGroup;
  jsonVolumetricShipRegisterFormArray: any;
  volumetricShipmentFormControls: volumetricShipmentRegisterControl
  custName: any;
  custStatus: any;
  branchStatus: any;
  branchName: any;
  protected _onDestroy = new Subject<void>();
  ReportingBranches: string[] = [];
  LoadTable = false;
  formTitle = "Volumetric-Shipment-Register_Report"
  csvFileName: string;
  source: any[] = [];
  columns = [];
  loading = true
  paging: any;
  sorting: any;
  searching: any;
  columnMenu: any;
  theme: "MATERIAL"
  submit = "Save";
  constructor(
    private fb: UntypedFormBuilder,
    private customerService: CustomerService,
    private filter: FilterUtils,
    private locationService: LocationService,
    private storage: StorageService,
    public snackBarUtilityService: SnackBarUtilityService,
    private generalLedgerReportService: GeneralLedgerReportService,
    private volumetricShipmentReportService: VolumetricShipmentReportService,
    private exportService: ExportService,
    private MCountrService: ModuleCounterService
  ) {
    this.initializeFormControl();
  }

  // CSVHeader = {
  //   "dktNo": "Docket No",
  //   "dktDt": "Docket Date",
  //   "invNo": "Invoice No",
  //   "invDt": "Invoice Date",
  //   "packT": "Packaging Type",
  //   "volum": "Volumetric Measure",
  //   "CFTRa": "CFTRatio",
  //   "len": "Length",
  //   "bth": "Breadth",
  //   "ht": "Height",
  //   "pkg": "Pkgs No",
  //   "cbw": "Cubic Weight",
  //   "cpkg": "Charged Pkgs No",
  //   "actw": "Actual Weight",
  //   "chw": "Charge Weight",
  //   "org": "Origin",
  //   "dst": "Destination",
  //   "fcy": "From City",
  //   "tcy": "To City",
  //   "pyb": "Pay Basis",
  //   "trm": "Transport Mode",
  //   "bkt": "Booking Type",
  //   "bpc": "Billing Party Code",
  //   "bpn": "Billing Party Name",
  //   "cnc": "Consignor Code",
  //   "cnn": "Consignor Name",
  //   "cnec": "Consignee Code",
  //   "cnen": "Consignee Name",
  //   "ctn": "Contents"
  // }

  //#region  initializeFormControl
  initializeFormControl() {
    this.volumetricShipmentFormControls = new volumetricShipmentRegisterControl();
    this.jsonVolumetricShipRegisterFormArray = this.volumetricShipmentFormControls.volumetricShipmentRegisterControlArray;
    this.custName = this.jsonVolumetricShipRegisterFormArray.find(
      (data) => data.name === "cust"
    )?.name;
    this.custStatus = this.jsonVolumetricShipRegisterFormArray.find(
      (data) => data.name === "cust"
    )?.additionalData.showNameAndValue;
    this.branchName = this.jsonVolumetricShipRegisterFormArray.find(
      (data) => data.name === "branch"
    )?.name;
    this.branchStatus = this.jsonVolumetricShipRegisterFormArray.find(
      (data) => data.name === "branch"
    )?.additionalData.showNameAndValue;
    this.volumetricShipRegisterTableForm = formGroupBuilder(this.fb, [this.jsonVolumetricShipRegisterFormArray]);
  }
  // #endregion

  ngOnInit(): void {
    const now = new Date();
    const lastweek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 10
    );
    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.volumetricShipRegisterTableForm.controls["start"].setValue(lastweek);
    this.volumetricShipRegisterTableForm.controls["end"].setValue(now);
    this.getDropDownList();
    this.csvFileName = "Volumetric-Shipment-Register_Report";
  }

  //#region getDropDownList()
  async getDropDownList() {
    const customer = await this.customerService.customerFromApi();
    const branchList = await this.locationService.locationFromApi();
    this.filter.Filter(
      this.jsonVolumetricShipRegisterFormArray,
      this.volumetricShipRegisterTableForm,
      customer,
      this.custName,
      this.custStatus
    );
    this.filter.Filter(
      this.jsonVolumetricShipRegisterFormArray,
      this.volumetricShipRegisterTableForm,
      branchList,
      this.branchName,
      this.branchStatus
    );
    const loginBranch = branchList.find(x => x.value === this.storage.branch);
    this.volumetricShipRegisterTableForm.controls["branch"].setValue(loginBranch);
    this.volumetricShipRegisterTableForm.get('Individual').setValue("Y");
  }
  //#endregion

  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonVolumetricShipRegisterFormArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonVolumetricShipRegisterFormArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.volumetricShipRegisterTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }

  // #region save
  async save() {
    this.loading = true;
    try {
      // Location
      this.ReportingBranches = [];
      if (this.volumetricShipRegisterTableForm.value.Individual == "N") {
        this.ReportingBranches = await this.generalLedgerReportService.GetReportingLocationsList(this.volumetricShipRegisterTableForm.value.branch.name);
        this.ReportingBranches.push(this.volumetricShipRegisterTableForm.value.branch.value);
      } else {
        this.ReportingBranches.push(this.volumetricShipRegisterTableForm.value.branch.value);
      }
      const branch = this.ReportingBranches;
      const individual = this.volumetricShipRegisterTableForm.value.Individual;
      // Date Range
      const startValue = new Date(this.volumetricShipRegisterTableForm.controls.start.value);
      const endValue = new Date(this.volumetricShipRegisterTableForm.controls.end.value);
      const startDate = moment(startValue).startOf('day').toDate();
      const endDate = moment(endValue).endOf('day').toDate();
      // Customer
      const customer = Array.isArray(this.volumetricShipRegisterTableForm.value.custHandler)
        ? this.volumetricShipRegisterTableForm.value.custHandler.map(x => x.value)
        : [];
      // GCN No
      const docketNo = this.volumetricShipRegisterTableForm.value.CGNNo;
      const docNoArray = docketNo.includes(',') ? docketNo.split(',') : [docketNo];
      // Mode
      const mode = this.storage.mode;
      const reqBody = {
        branch, individual, startDate, endDate, customer, docNoArray, mode
      }
      const result = await this.volumetricShipmentReportService.getVolumetricShipmentDetail(reqBody);
      this.columns = result.grid.columns;
      this.sorting = result.grid.sorting;
      this.searching = result.grid.searching;
      this.paging = result.grid.paging;

      this.source = result.data;
      this.LoadTable = true;
      if (this.source.length === 0) {
        if (this.source) {
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
      this.snackBarUtilityService.ShowCommonSwal("error", error.message);
    }
  }
  // #endregion

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
