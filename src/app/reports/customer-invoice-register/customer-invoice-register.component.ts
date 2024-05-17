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
  }

  //#region
  CSVHeader = {
    bILLNO: "Invoice No",
    bGNDT: "Invoice Date",
    dOCTYP: "Document Type",
    bSTSNM: "Invoice Status",
    nM: "Party",
    STIN: "Party GSTN",
    bLOC: "Invoice Branch",
    gSTIN: "Generation GST No",
    nRT: "Narration",
    lOC: "Invoice Submitted At",
    eXMT: "RCM",
    sCOD: "SAC Code",
    rATE: "GST Rate",
    gROSSAMT: "Total Taxable Amt",
    aMT: "GST Total", //gST.aMT
    iGST: "IGST",
    cGST: "CGST",
    sGST: "SGST",
    uTGST: "UGST",
    dKTTOT: "Total Invoice Value",
    cAMT: "Collected Amt", //cOL.aMT
    bALAMT: "Pending Amt", //cOL.bALAMT
    // "": "Credit Note Amt", cd_note_header aMT
    tDSAMT: "TDS Amount",//voucher_trans tDSAMT
    // "": "TDS Sec",
    // "": "Party Type", eXMT
    // "": "Invoice Gen State",
    // "": "Gst Exempted",eXMT
    pAYBAS: "Pay Basis",
    mRNO: "MR No",
    dTM: "MR Date", // cust_bill_collection
    // "": "Credit Note No", nTNO  cd_note_header
    // "": "Credit Note Date",nTDT  cd_note_header
    // "": "GST Exemption Category",
    geNTBY: "Invoice Generated By",
    eNTDT: "Generated On",
    // "": "Submitted By",
    // "": "Submitted On",
    // "": "Approved By",
    // "": "Approved On",
    // "": "Collected By",
    // "": "Collected On",
    // "": "Credit Note Generated By", eNTBY cd_note_header
    glOC: "Generated On",
    eNTBY: "UserId",
    // "": "IrnNo",
  };
  //#endregion

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
      (data) => data.name === "lOC"
    )?.name;
    this.branchStatus = this.jsonCustInvREGFormArray.find(
      (data) => data.name === "lOC"
    )?.additionalData.showNameAndValue;
    this.CustInvREGTableForm = formGroupBuilder(this.fb, [
      this.jsonCustInvREGFormArray,
    ]);
  }
  //#endregion

  //#region
  async getCustomer() {
    await this.customerService.getCustomerForAutoComplete(
      this.CustInvREGTableForm,
      this.jsonCustInvREGFormArray,
      "CUST",
      true
    );
  }
  //#endregion

  //#region
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
    this.CustInvREGTableForm.controls["lOC"].setValue(loginBranch);
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
    this.snackBarUtilityService.commonToast(async () => {
      try {
        const startDate = new Date(this.CustInvREGTableForm.controls.start.value);
        const endDate = new Date(this.CustInvREGTableForm.controls.end.value);
        const startValue = moment(startDate).startOf('day').toDate();
        const endValue = moment(endDate).endOf('day').toDate();
        const docNo = this.CustInvREGTableForm.value.dNO
        const Individual = this.CustInvREGTableForm.value.Individual

        // const PRQNo = this.CustInvREGTableForm.value.prqNo;
        // const prqArray = PRQNo
          // ? PRQNo.includes(",")
          //   ? PRQNo.split(",")
        //     : [PRQNo]
        //   : [];
        // const startValue = new Date(
        //   this.CustInvREGTableForm.controls.start.value
        // );
        // const endValue = new Date(this.CustInvREGTableForm.controls.end.value);
        // const billparty = Array.isArray(
        //   this.CustInvREGTableForm.value.bpartyHandler
        // )
        //   ? this.CustInvREGTableForm.value.bpartyHandler.map((x) => {
        //       return { BPartyCD: x.value, prqBPartyNm: x.name };
        //     })
        //   : [];
        const data = await this.billdetails.getcustInvRegReportDetail(
          startValue,endValue,docNo
        );
        if (data.length === 0) {
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
        Swal.hideLoading();
        setTimeout(() => {
          Swal.close();
        }, 1000);
        // Assuming exportAsExcelFile is a function that exports data to Excel
        this.exportService.exportAsCSV(data, `Customer_Invoice_Register_Report-${timeString}`, this.CSVHeader);
      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal("error", error.message);
      }
    }, "Customer_Invoice_Register_Report Generating Please Wait..!");
  }
  //#endregion
}
