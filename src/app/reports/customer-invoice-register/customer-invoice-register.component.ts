import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { CustomerService } from "src/app/Utility/module/masters/customer/customer.service";
import { StateService } from "src/app/Utility/module/masters/state/state.service";
import { CustInvRegFormControl } from "src/assets/FormControls/Reports/Customer-invoice-register/CustomerInvoiceRegisterControls";
import { GetsachsnFromApi } from "src/app/finance/Vendor Bills/VendorGeneralBill/general-bill-detail/generalbillAPIUtitlity";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { CustomerBillStatus } from "src/app/Models/docStatus";
import moment from "moment";
import Swal from "sweetalert2";
import { ExportService } from "src/app/Utility/module/export.service";
import { timeString } from "src/app/Utility/date/date-utils";
import { CustInvoiceRegService } from "src/app/Utility/module/reports/customer-invoice-register-service";
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import { LocationService } from "src/app/Utility/module/masters/location/location.service";
import { StorageService } from "src/app/core/service/storage.service";
import { GeneralLedgerReportService } from "src/app/Utility/module/reports/general-ledger-report.service";
import { firstValueFrom } from 'rxjs';
import { WINDOW } from "src/app/core/service/window.service";

@Component({
  selector: "app-customer-invoice-register",
  templateUrl: "./customer-invoice-register.component.html",
})
export class CustomerInvoiceRegisterComponent implements OnInit {
  //#region breadScrums
  breadScrums = [
    {
      title: "Customer Invoice Register Report ",
      items: ["Reports"],
      active: "Customer Invoice Register Report ",
    },
  ];
  //#endregion

  CustInvREGTableForm: UntypedFormGroup;
  jsonCustInvREGFormArray: any;
  CustInvREGFormControl: CustInvRegFormControl;
  stateName: any;
  stateStatus: any;
  SACCodeList: any = [];
  submit = "Save";
  branchName: any;
  branchStatus: any;
  ReportingBranches: string[] = [];
  formTitle = "Customer Invoice Register Data"
  csvFileName: string; // name of the csv file, when data is downloaded
  source: any[] = []; // Array to hold data
  loading = true // Loading indicator
  LoadTable=false;  

  //#region Table 
  columns = [];
  //#endregion

  paging: any ;
  sorting: any ;
  searching: any ;
  columnMenu: any ;
  theme: "MATERIAL"

  constructor(
    public snackBarUtilityService: SnackBarUtilityService,
    private fb: UntypedFormBuilder,
    private customerService: CustomerService,
    private objStateService: StateService,
    private storage: StorageService,
    private masterService: MasterService,
    private filter: FilterUtils,
    private exportService: ExportService,
    private billdetails: CustInvoiceRegService,
    private locationService: LocationService,
    private generalLedgerReportService: GeneralLedgerReportService,

  ) {
    this.initializeFormControl();
  }

  ngOnInit(): void {
    this.getDropDownList();
    const now = new Date();
    const lastweek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 100
    );
    this.CustInvREGTableForm.controls["start"].setValue(lastweek);
    this.CustInvREGTableForm.controls["end"].setValue(now);
    this.csvFileName = "Customer_Invoice_Register_Report";
  }


  //#region  initializeFormControl
  initializeFormControl() {
    this.CustInvREGFormControl = new CustInvRegFormControl();
    this.jsonCustInvREGFormArray =
      this.CustInvREGFormControl.getCustInvRegFormControls();
    this.stateName = this.jsonCustInvREGFormArray.find(
      (data) => data.name === "gSTE"
    )?.name;
    this.stateStatus = this.jsonCustInvREGFormArray.find(
      (data) => data.name === "gSTE"
    )?.additionalData.showNameAndValue;
    this.branchName = this.jsonCustInvREGFormArray.find(
      (data) => data.name === "branch"
    )?.name;
    this.branchStatus = this.jsonCustInvREGFormArray.find(
      (data) => data.name === "branch"
    )?.additionalData.showNameAndValue;
    this.CustInvREGTableForm = formGroupBuilder(this.fb, [
      this.jsonCustInvREGFormArray,
    ]);
  }
  //#endregion

  //#region getCustomer()
  async getCustomer() {
    await this.customerService.getCustomerForAutoComplete(
      this.CustInvREGTableForm,
      this.jsonCustInvREGFormArray,
      "CUST",
      true
    );
  }
  //#endregion

  //#region getDropDownList()
  async getDropDownList() {
    const statelist = await this.objStateService.getState();
    this.filter.Filter(
      this.jsonCustInvREGFormArray,
      this.CustInvREGTableForm,
      statelist,
      this.stateName,
      this.stateStatus
    );
    this.SACCodeList = await GetsachsnFromApi(this.masterService);
    this.filter.Filter(
      this.jsonCustInvREGFormArray,
      this.CustInvREGTableForm,
      this.SACCodeList,
      "sACCODE",
      false
    );
    const branchList = await this.locationService.locationFromApi();
    this.filter.Filter(
      this.jsonCustInvREGFormArray,
      this.CustInvREGTableForm,
      branchList,
      this.branchName,
      this.branchStatus
    );
    const loginBranch = branchList.find(x => x.name === this.storage.branch);
    this.CustInvREGTableForm.controls["branch"].setValue(loginBranch);
    this.CustInvREGTableForm.get('Individual').setValue("Y");

    const data = Object.entries(CustomerBillStatus)
      .filter(([_key, dataValue]) => typeof dataValue === "number")
      .map(([name, value]) => ({ name, value: String(value) })); // Explicitly cast value to string
    this.filter.Filter(
      this.jsonCustInvREGFormArray,
      this.CustInvREGTableForm,
      data,
      "sTS",
      false
    );
  }
  //#endregion

  //#region  functionCallHandler
  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  //#endregion

  //#region save
  async save() {
    this.loading = true;
    try {
      this.ReportingBranches = [];
      if (this.CustInvREGTableForm.value.Individual == "N") {
        this.ReportingBranches = await this.generalLedgerReportService.GetReportingLocationsList(this.CustInvREGTableForm.value.branch.name);
        this.ReportingBranches.push(this.CustInvREGTableForm.value.branch.name);
      } else {
        this.ReportingBranches.push(this.CustInvREGTableForm.value.branch.name);
      }
      const startDate = new Date(this.CustInvREGTableForm.controls.start.value);
      const endDate = new Date(this.CustInvREGTableForm.controls.end.value);
      const startValue = moment(startDate).startOf('day').toDate();
      const endValue = moment(endDate).endOf('day').toDate();
      const docNo = this.CustInvREGTableForm.value.dNO;
      const state = this.CustInvREGTableForm.value.gSTE.value;
      const status = this.CustInvREGTableForm.value.sTS.value;
      const cust = this.CustInvREGTableForm.value.CUST.name;
      const sac = this.CustInvREGTableForm.value.sACCODE.value;
      const branch = this.ReportingBranches;
      const individual = this.CustInvREGTableForm.value.Individual;
      const reqBody = {
        startValue, endValue, docNo, state, status, sac, cust, branch, individual
      }
      const result = await this.billdetails.getcustInvRegReportDetail(reqBody);
      console.log("data", result);
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
    } catch (error) {
      this.snackBarUtilityService.ShowCommonSwal("error", error.message);
    }
  }
  //#endregion

}
