import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { calculateTotalField } from 'src/app/operation/unbilled-prq/unbilled-utlity';
import { bankReconciliationControl } from 'src/assets/FormControls/bank-reconciliation-control';

@Component({
  selector: 'app-bank-reconciliation',
  templateUrl: './bank-reconciliation.component.html'
})
export class BankReconciliationComponent implements OnInit {

  tableLoad: boolean = true;
  BankTableForm: UntypedFormGroup;
  BankFormControls: bankReconciliationControl;
  jsonControlArray: any;
  KPICountData: { count: any; title: string; class: string }[];
  KPICountData1: { count: any; title: string; class: string }[];
  router: any;
  dynamicControls = {
    add: true,
    edit: true,
    csv: false,
  };
  columnHeader = {
    chequeNumber: {
      Title: "Cheque Number",
      class: "matcolumncenter",
      Style: "",
    },
    voucherNo: {
      Title: "Voucher No",
      class: "matcolumncenter",
      Style: "",
    },
    voucherDate: {
      Title: "Voucher Date",
      class: "matcolumncenter",
      Style: "",
    },
    party: {
      Title: "Party",
      class: "matcolumncenter",
      Style: "",
    },
    amount: {
      Title: "Amount",
      class: "matcolumncenter",
      Style: "",
    },
    clearanceDate: {
      Title: "Clearance Date",
      class: "matcolumncenter",
      Style: "",
    },
    comments: {
      Title: "Comments",
      class: "matcolumncenter",
      Style: "",
    },
  };
  columnHeader1 = {
    chequeNumber: {
      Title: "Cheque Number",
      class: "matcolumncenter",
      Style: "",
    },
    voucherNo: {
      Title: "Voucher No",
      class: "matcolumncenter",
      Style: "",
    },
    voucherDate: {
      Title: "Voucher Date",
      class: "matcolumncenter",
      Style: "",
    },
    party: {
      Title: "Party",
      class: "matcolumncenter",
      Style: "",
    },
    amounts: {
      Title: "Amount",
      class: "matcolumncenter",
      Style: "",
    },
    clearanceDate: {
      Title: "Clearance Date",
      class: "matcolumncenter",
      Style: "",
    },
    comments: {
      Title: "Comments",
      class: "matcolumncenter",
      Style: "",
    },
  };
  tableData = [
    {
      chequeNumber: 212134,
      voucherNo: "VR/DELB/2324/0000001",
      voucherDate: "12 Sep 23",
      party: "DTDC : C000001",
      amount: "Rs.20,000.00",
      clearanceDate:'',
      comments:''
    },
    {
      chequeNumber: 355465,
      voucherNo: "VR/DELB/2324/0000005",
      voucherDate: "13 Sep 23",
      party: "DTDC : C000001",
      amount: "Rs.30,000.00",
      clearanceDate:"",
      comments:''
    }
  ];
  tableData1 = [
    {
      chequeNumber: 854773,
      voucherNo: "VR/DELB/2324/0000002",
      voucherDate: "12 Sep 23",
      party: "ABC Transport : V000045",
      amounts: "Rs.60,000.00",
      clearanceDate:'',
      comments:''
    }
  ];
  staticField = ["chequeNumber", "voucherNo", "voucherDate", "party", "amount", "clearanceDate","comments"];
  staticField1 = ["chequeNumber", "voucherNo", "voucherDate", "party", "amounts", "clearanceDate","comments"];
  constructor(private fb: UntypedFormBuilder) {
    this.tableLoad = false;
    const amount = calculateTotalField(this.tableData, 'amount');
    const amounts = calculateTotalField(this.tableData1, 'amounts');
    this.KPICountData = [
      {
        count: amount,
        title: "Total Transaction Amount",
        class: `color-Grape-light`,
      }
    ]
    this.KPICountData1 = [
      {
        count: amounts,
        title: "Total Transaction Amount",
        class: `color-Grape-light`,
      }
    ]
  }

  ngOnInit(): void {
    this.initializeFormControl()
  }

  initializeFormControl() {
    this.BankFormControls = new bankReconciliationControl();
    // Get form controls for job Entry form section
    this.jsonControlArray = this.BankFormControls.getHandOverArrayControls();
    // Build the form group using formGroupBuilder function
    this.BankTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }
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
  save() {}
}
