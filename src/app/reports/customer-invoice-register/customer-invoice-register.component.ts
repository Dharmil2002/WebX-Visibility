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
import { CustInvoiceRegService } from "src/app/Utility/module/reports/customer-invoice-register-service";
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import { LocationService } from "src/app/Utility/module/masters/location/location.service";
import { StorageService } from "src/app/core/service/storage.service";
import { GeneralLedgerReportService } from "src/app/Utility/module/reports/general-ledger-report.service";
import { ModuleCounterService } from "src/app/core/service/Logger/module-counter-service.service";
import { NavDataService } from "src/app/core/service/navdata.service";

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
  branchName: any;
  branchStatus: any;
  formTitle = "Customer Invoice Register Data"
  csvFileName: string; // name of the csv file, when data is downloaded
  source: any[] = [];

  constructor(
    public snackBarUtilityService: SnackBarUtilityService,
    private fb: UntypedFormBuilder,
    private customerService: CustomerService,
    private objStateService: StateService,
    private storage: StorageService,
    private masterService: MasterService,
    private filter: FilterUtils,
    private billdetails: CustInvoiceRegService,
    private locationService: LocationService,
    private generalLedgerReportService: GeneralLedgerReportService,
    private MCountrService: ModuleCounterService,
    private nav: NavDataService
  ) {
    this.initializeFormControl();
  }

  ngOnInit(): void {
    this.getDropDownList();
    const now = new Date();
    const lastweek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 10
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
    this.CustInvREGTableForm.controls["Individual"].setValue('Cumulative');
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
    const loginBranch = branchList.find(x => x.value === this.storage.branch);
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

    try {
      let ReportingBranches = [];
      if (this.CustInvREGTableForm.value.Individual == "N") {
        ReportingBranches = await this.generalLedgerReportService.GetReportingLocationsList(this.CustInvREGTableForm.value.branch.name);
        ReportingBranches.push(this.CustInvREGTableForm.value.branch?.value || "");
      } else {
        ReportingBranches.push(this.CustInvREGTableForm.value.branch?.value || "");
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
      const branch = ReportingBranches;
      const individual = this.CustInvREGTableForm.value.Individual;
      const reqBody = {
        startValue, endValue, docNo, state, status, sac, cust, branch, individual
      }
      const result = await this.billdetails.getcustInvRegReportDetail(reqBody);
      this.source = result.data;

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

      // Prepare the state data to include all necessary properties
      const stateData = {
        data: result,
        formTitle: this.formTitle,
        csvFileName: this.csvFileName
      };
      // Convert the state data to a JSON string and encode it        
      this.nav.setData(stateData);
      // Create the new URL with the state data as a query parameter
      const url = `/#/Reports/generic-report-view`;
      // Open the URL in a new tab
      window.open(url, '_blank');
      // Push the module counter data to the server
      this.MCountrService.PushModuleCounter();
    } catch (error) {
      this.snackBarUtilityService.ShowCommonSwal("error", error.message);
    }
  }
  //#endregion

}