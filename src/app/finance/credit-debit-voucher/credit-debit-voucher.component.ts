import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { CreditDebitVoucherControl } from 'src/assets/FormControls/Finance/CreditDebitVoucher/creditdebitvouchercontrol';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-credit-debit-voucher',
  templateUrl: './credit-debit-voucher.component.html',
})
export class CreditDebitVoucherComponent implements OnInit {
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
  public ModeldataSource = new MatTableDataSource<any>();

  // EditAble Table 
  tableData: any = [];
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
  actionObject = {
    addRow: true,
    submit: true,
    search: true
  };
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private masterService: MasterService
  ) {
    this.VoucherDetailsDisplayedColumns.Ledger.option = [
      { "name": "EXP001: Conveyance", "value": "EXP001" },
      { "name": "EXP002: Communication", "value": "EXP002" },
      { "name": "EXP003: Communication", "value": "EXP003" }
    ];
    this.VoucherDetailsDisplayedColumns.SACCode.option = [
      { "name": "12022: Local conveyance", "value": "12022" },
      { "name": "12088: Telecom services", "value": "12088" },
      { "name": "12089: Telecom services", "value": "12089" }
    ];
    this.ModeldataSource.data = [
      {
        Ledger: "EXP001: Conveyance",
        SACCode: "12022: Local conveyance",
        DebitAmount: "3450.50",
        GSTRate: "0",
        GSTAmount: "",
        Total: "3450.50",
        TDSApplicable: "No",
        Narration: "For local conveyance at Andheri"
      },
      {
        Ledger: "EXP003: Communication",
        SACCode: "12088: Telecom services",
        DebitAmount: "2340.00",
        GSTRate: "12%",
        GSTAmount: "280.8",
        Total: "2620.80",
        TDSApplicable: "Yes",
        Narration: "For phone expense"
      },
    ]
  }
  ngOnInit(): void {
    this.initializeFormControl();
    this.addVoucherDetails('')
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

  }
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  async save() {
  }
  cancel(tabIndex: string): void {
    this.router.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex }, state: [] });
  }
  // Add a new item to the table
  addVoucherDetails(event) {
    // const city = this.cityLocationTableForm.value?.city.name || ""
    const addObj = {
      Ledger: "EXP001",
      SACCode: "12088",
      action: ""
    };
    this.tableData.splice(0, 0, addObj);
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
