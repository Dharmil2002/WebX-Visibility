import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/Utility/commonFunction/route/route';
import { financialYear } from 'src/app/Utility/date/date-utils';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { VoucherServicesService } from 'src/app/core/service/Finance/voucher-services.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { SessionService } from 'src/app/core/service/session.service';
import { customerFromApi } from 'src/app/operation/prq-entry-page/prq-utitlity';
import { CreditDebitVoucherControl } from 'src/assets/FormControls/Finance/CreditDebitVoucher/creditdebitvouchercontrol';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-credit-debit-voucher',
  templateUrl: './credit-debit-voucher.component.html',
})
export class CreditDebitVoucherComponent implements OnInit {
  companyCode: number | null
  breadScrums = [
    {
      title: "Credit Debit Voucher",
      items: ["Finance"],
      active: "Credit Debit Voucher",
    },
  ];
  className = "col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-2";
  creditDebitVoucherControl: CreditDebitVoucherControl;

  CreditDebitVoucherSummaryForm: UntypedFormGroup;
  jsonControlCreditDebitVoucherSummaryArray: any;

  //Taxation Form Config
  CreditDebitVoucherTaxationTDSForm: UntypedFormGroup;
  jsonControlCreditDebitVoucherTaxationTDSArray: any;

  CreditDebitVoucherTaxationTCSForm: UntypedFormGroup;
  jsonControlCreditDebitVoucherTaxationTCSArray: any;

  CreditDebitVoucherTaxationGSTForm: UntypedFormGroup;
  jsonControlCreditDebitVoucherTaxationGSTArray: any;

  CreditDebitVoucherTaxationPaymentSummaryForm: UntypedFormGroup;
  jsonControlCreditDebitVoucherTaxationPaymentSummaryArray: any;

  CreditDebitVoucherTaxationPaymentDetailsForm: UntypedFormGroup;
  jsonControlCreditDebitVoucherTaxationPaymentDetailsArray: any;


  CreditDebitVoucherDocumentDebitsForm: UntypedFormGroup;
  jsonControlCreditDebitVoucherDocumentDebitsArray: any;

  displayedColumns = [
    {
      Key: "Ledger", title: "Ledger", width: "200", className: "matcolumnleft", show: true
    },
    { Key: "SACCode", title: "SAC Code", width: "200", className: "matcolumnleft", show: true },
    {
      Key: "DebitAmount", title: "Debit Amount ₹", width: "70", className: "matcolumncenter", show: true
    },
    {
      Key: "GSTRate", title: "GST Rate", width: "70", className: "matcolumncenter", show: true
    },
    {
      Key: "GSTAmount", title: "GST Amount ₹", width: "70", className: "matcolumncenter", show: true
    },
    {
      Key: "Total", title: "Total ₹", width: "70", className: "matcolumncenter", show: true
    },
    {
      Key: "TDSApplicable", title: "TDS Applicable", width: "100", className: "matcolumncenter", show: true
    },
    {
      Key: "Narration", title: "Narration", width: "200", className: "matcolumnleft", show: true
    },
  ];
  columnKeys = this.displayedColumns.map((column) => column.Key);
  // EditAble Table 
  tableData: any = [];
  DocumentDebits: any = [];
  //Displayed columns City location configuration
  VoucherDetailsDisplayedColumns = {

    Ledger: {
      name: "Ledger",
      key: "Dropdown",
      option: [],
      style: "",
      class: 'matcolumnfirst'
    },
    SACCode: {
      name: "SAC Code",
      key: "Dropdown",
      option: [],
      style: "",
      class: 'matcolumncenter'
    },
    DebitAmount: {
      name: "Debit Amount ₹",
      key: "inputnumber",
      style: "",
      class: 'matcolumncenter'
    },
    GSTRate: {
      name: "GST Rate %",
      key: "inputnumber",
      style: "",
      class: 'matcolumncenter'
    },
    GSTAmount: {
      name: "GST Amount ₹",
      key: "inputnumber",
      style: "",
      class: 'matcolumncenter'
    },
    Total: {
      name: "Total ₹",
      key: "inputnumber",
      style: "",
      class: 'matcolumncenter'
    },
    TDSApplicable: {
      name: "TDS Applicable",
      key: "togleCheckBox",
      style: "max-width: 80px;",
      class: 'matcolumncenter'
    },
    Narration: {
      name: "Narration",
      key: "inputString",
      style: "",
      class: 'matcolumncenter'
    },
    action: {
      name: "Action",
      key: "Action",
      style: "",
      class: 'matcolumncenter'
    }
  };
  DocumentDebitsDisplayedColumns = {

    Document: {
      name: "Document ",
      key: "Dropdown",
      option: [],
      style: "",
      class: 'matcolumnfirst'
    },
    DebitAmount: {
      name: "Debit Amount ₹",
      key: "inputnumber",
      style: "",
      class: 'matcolumncenter'
    },

    action: {
      name: "Action",
      key: "Action",
      style: "",
      class: 'matcolumncenter'
    }
  };
  actionObject = {
    addRow: true,
    submit: true,
    search: true
  };

  PartyNameList: any;
  StateList: any;
  AccountGroupList: any;
  DisplayCreditDebitVoucherDocument: boolean = false;
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private filter: FilterUtils,
    private sessionService: SessionService,
    private masterService: MasterService,
    private navigationService: NavigationService,
    private voucherServicesService: VoucherServicesService,
  ) {
    this.companyCode = this.sessionService.getCompanyCode()
    // this.VoucherDetailsDisplayedColumns.Ledger.option = [
    //   { "name": "EXP001: Conveyance", "value": "EXP001" },
    //   { "name": "EXP002: Communication", "value": "EXP002" },
    //   { "name": "EXP003: Communication", "value": "EXP003" }
    // ];
    this.VoucherDetailsDisplayedColumns.SACCode.option = [
      { "name": "12022: Local conveyance", "value": "12022" },
      { "name": "12088: Telecom services", "value": "12088" },
      { "name": "12089: Telecom services", "value": "12089" }
    ];

  }
  ngOnInit(): void {
    this.BindDataFromApi();
    this.initializeFormControl();
    this.addVoucherDetails('')
    this.AddDocumentDebits('');
  }
  initializeFormControl() {
    this.creditDebitVoucherControl = new CreditDebitVoucherControl();
    this.jsonControlCreditDebitVoucherSummaryArray = this.creditDebitVoucherControl.getCreditDebitVoucherSummaryArrayControls();
    this.CreditDebitVoucherSummaryForm = formGroupBuilder(this.fb, [this.jsonControlCreditDebitVoucherSummaryArray]);

    this.jsonControlCreditDebitVoucherTaxationTDSArray = this.creditDebitVoucherControl.getCreditDebitVoucherTaxationTDSArrayControls();
    this.CreditDebitVoucherTaxationTDSForm = formGroupBuilder(this.fb, [this.jsonControlCreditDebitVoucherTaxationTDSArray]);

    this.jsonControlCreditDebitVoucherTaxationTCSArray = this.creditDebitVoucherControl.getCreditDebitVoucherTaxationTCSArrayControls();
    this.CreditDebitVoucherTaxationTCSForm = formGroupBuilder(this.fb, [this.jsonControlCreditDebitVoucherTaxationTCSArray]);

    this.jsonControlCreditDebitVoucherTaxationGSTArray = this.creditDebitVoucherControl.getCreditDebitVoucherTaxationGSTArrayControls();
    this.CreditDebitVoucherTaxationGSTForm = formGroupBuilder(this.fb, [this.jsonControlCreditDebitVoucherTaxationGSTArray]);

    this.jsonControlCreditDebitVoucherTaxationPaymentSummaryArray = this.creditDebitVoucherControl.getCreditDebitVoucherTaxationPaymentSummaryArrayControls();
    this.CreditDebitVoucherTaxationPaymentSummaryForm = formGroupBuilder(this.fb, [this.jsonControlCreditDebitVoucherTaxationPaymentSummaryArray]);

    this.jsonControlCreditDebitVoucherTaxationPaymentDetailsArray = this.creditDebitVoucherControl.getCreditDebitVoucherTaxationPaymentDetailsArrayControls();
    this.CreditDebitVoucherTaxationPaymentDetailsForm = formGroupBuilder(this.fb, [this.jsonControlCreditDebitVoucherTaxationPaymentDetailsArray]);

    this.jsonControlCreditDebitVoucherDocumentDebitsArray = this.creditDebitVoucherControl.getCreditDebitVoucherDocumentDebitsArrayControls();
    this.CreditDebitVoucherDocumentDebitsForm = formGroupBuilder(this.fb, [this.jsonControlCreditDebitVoucherDocumentDebitsArray]);

  }
  async BindDataFromApi() {
    const stateReqBody = {
      companyCode: this.companyCode,
      filter: {},
      collectionName: "state_master",
    };
    const account_groupReqBody = {
      companyCode: this.companyCode,
      collectionName: "account_group_detail",
      filter: {},
    };

    const resCust = await customerFromApi(this.masterService);
    this.PartyNameList = resCust;
    const resState = await this.masterService.masterPost('generic/get', stateReqBody).toPromise();
    this.StateList = resState?.data
      .map(x => ({ value: x.STNM, name: x.ST }))
      .filter(x => x != null)
      .sort((a, b) => a.value.localeCompare(b.value));

    const resaccount_group = await this.masterService.masterPost('generic/get', account_groupReqBody).toPromise();
    this.AccountGroupList = resaccount_group?.data
      .map(x => ({ value: x.GroupCode + ":" + x.GroupName, name: x.GroupCode + ":" + x.GroupName }))
      .filter(x => x != null)
      .sort((a, b) => a.value.localeCompare(b.value));
    this.VoucherDetailsDisplayedColumns.Ledger.option = this.AccountGroupList
    this.filter.Filter(
      this.jsonControlCreditDebitVoucherSummaryArray,
      this.CreditDebitVoucherSummaryForm,
      resCust,
      "PartyName",
      false
    );
    this.filter.Filter(
      this.jsonControlCreditDebitVoucherSummaryArray,
      this.CreditDebitVoucherSummaryForm,
      this.StateList,
      "Partystate",
      null
    );
    this.filter.Filter(
      this.jsonControlCreditDebitVoucherSummaryArray,
      this.CreditDebitVoucherSummaryForm,
      this.StateList,
      "Paymentstate",
      false
    );


  }
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  async save1() {
    console.log(this.tableData)
    console.log(this.CreditDebitVoucherSummaryForm.value)
    // CreditDebitVoucherSummaryForm: UntypedFormGroup;
    // CreditDebitVoucherTaxationTDSForm: UntypedFormGroup;
    // CreditDebitVoucherTaxationTCSForm: UntypedFormGroup;
    // CreditDebitVoucherTaxationGSTForm: UntypedFormGroup;
    // CreditDebitVoucherTaxationPaymentSummaryForm: UntypedFormGroup;
    // CreditDebitVoucherTaxationPaymentDetailsForm: UntypedFormGroup;
    // CreditDebitVoucherDocumentDebitsForm: UntypedFormGroup;

  }
  async save() {
    // Create a new array to store the transformed data
    var transformedData = this.tableData.map(function (item) {
      // Split the "Ledger" value into "accCode" and "accName"
      var ledgerParts = item.Ledger.split(":");
      // Create a new object with the desired structure
      return {
        "accCode": ledgerParts[0],
        "accName": ledgerParts[1],
        "amount": item.Total,
        "narration": item.Narration
      };
    });
    console.log(this.CreditDebitVoucherSummaryForm.value)
    let reqBody = {
      companyCode: this.companyCode,
      voucherNo: "VR0002",
      transDate: Date(),
      finYear: financialYear,
      branch: localStorage.getItem("Branch"),
      transType: "DebitVoucher",
      docType: "Voucher",
      docNo: "VR0002",
      partyCode: this.CreditDebitVoucherSummaryForm.value?.PartyName?.value,
      partyName: this.CreditDebitVoucherSummaryForm.value?.PartyName?.name,
      entryBy: localStorage.getItem("UserName"),
      entryDate: Date(),
      debit: transformedData,
      credit: transformedData,

    };
    this.voucherServicesService
      .FinancePost("fin/account/posting", reqBody)
      .subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: "success",
            title: "Voucher Created Successfully",
            text:
              "",
            showConfirmButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              // Redirect to the desired page after the success message is confirmed.
              this.navigationService.navigateTotab(
                "docket",
                "dashboard/Index"
              );
            }
          });
        },
      });
  }
  cancel(tabIndex: string): void {
    this.router.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex }, state: [] });
  }
  showhidebuttonclick(event) {
    this.DisplayCreditDebitVoucherDocument = !this.DisplayCreditDebitVoucherDocument
  }
  // Add a new item to the table
  addVoucherDetails(event) {
    const addObj = {
      Ledger: "EXP001",
      SACCode: "12088",
      action: ""
    };
    this.tableData.splice(0, 0, addObj);

  }
  // Add a new item to the table
  AddDocumentDebits(event) {
    const addObj = {
      Ledger: "EXP001",
      SACCode: "12088",
      action: ""
    };
    this.DocumentDebits.splice(0, 0, addObj);

  }
  async delete(event, tableData) {
    const index = event.index;
    const row = event.element;

    const swalWithBootstrapButtons = await Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success msr-2",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: `<h4><strong>Are you sure you want to delete ?</strong></h4>`,
        showCancelButton: true,
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        showLoaderOnConfirm: true,
        preConfirm: (Remarks) => {
          var request = {
            companyCode: localStorage.getItem("CompanyCode"),
            id: row.id,
          };
          if (row.id == 0) {
            return {
              isSuccess: true,
              message: "Data has been deleted !",
            };
          } else {
            console.log("Request", request);
          }
        },
        allowOutsideClick: () => !Swal.isLoading(),
      })
      .then((result) => {
        if (result.isConfirmed) {
          this[tableData].splice(index, 1);
          swalWithBootstrapButtons.fire("Deleted!", "Your data has been deleted successfully", "success");
          event.callback(true);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire("Cancelled", "Your item is safe :)", "error");
          event.callback(false);
        } else {
          swalWithBootstrapButtons.fire("Not Deleted!", "Your data remains safe", "info");
          event.callback(false);
        }
      });

    return true;
  }
  saveData(event) {

  }
}
