import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { calculateTotalField } from 'src/app/operation/unbilled-prq/unbilled-utlity';
import { bankReconciliationControl } from 'src/assets/FormControls/bank-reconciliation-control';
import { GetBankDropDown, getbankreconcilationList } from './bank-reconcilation-utility';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { DatePipe } from '@angular/common';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';

@Component({
  selector: 'app-bank-reconciliation',
  templateUrl: './bank-reconciliation.component.html'
})
export class BankReconciliationComponent implements OnInit {

  tableLoad: boolean = true;
  BankTableForm: UntypedFormGroup;
  BankFormControls: bankReconciliationControl;
  jsonControlArray: any;
  VendorKPIData: { count: any; title: string; class: string }[];
  CustomerKPIData: { count: any; title: string; class: string }[];
  router: any;

  dynamicControls = {
    add: false,
    edit: false,
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
      datatype: 'datetime'
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
    ClearanceDate: {
      Title: "Clearance Date",
      class: "matcolumncenter",
      Style: "",
      datatype: 'datetime'
    },
    Comments: {
      Title: "Comments",
      class: "matcolumncenter",
      Style: "",
    },
  };
  EventButton = {
    functionName: "openFilterDialog",
    name: "Filter",
    iconName: "filter_alt",
  };

  CustomerTableData = [];
  VendorTableData = [];
  AccountsBanksList: any;
  staticField = ["chequeNumber", "voucherNo", "voucherDate", "party", "amount", "ClearanceDate", "Comments"];
  constructor(private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private filter: FilterUtils,
    private datePipe: DatePipe,) {
    this.tableLoad = false;


  }

  ngOnInit(): void {
    this.initializeFormControl()
    this.getVoucherList('')
  }
  reloadData() {
    console.log(this.BankTableForm.value)
    const Request = {
      bank: this.BankTableForm.value?.bank?.Bankname ?? '',
    }
    this.getVoucherList(Request)
  }
  async GetDropDownData() {
    this.AccountsBanksList = await GetBankDropDown(this.masterService)
    this.filter.Filter(
      this.jsonControlArray,
      this.BankTableForm,
      this.AccountsBanksList,
      "bank",
      false
    );
  }
  initializeFormControl() {
    this.BankFormControls = new bankReconciliationControl();
    // Get form controls for job Entry form section
    this.jsonControlArray = this.BankFormControls.getHandOverArrayControls();
    // Build the form group using formGroupBuilder function
    this.BankTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);

    this.GetDropDownData()

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
  async getVoucherList(Request) {
    await getbankreconcilationList(this.masterService, Request).then((data) => {
      this.CustomerTableData = data.filter(x => x.VoucherFor === 'Customer');
      this.VendorTableData = data.filter(x => x.VoucherFor === 'Vendor');
      this.tableLoad = false;
      const CustomerAmt = calculateTotalField(this.CustomerTableData, 'amount');
      const VendorAmt = calculateTotalField(this.VendorTableData, 'amount');
      this.CustomerKPIData = [
        {
          count: CustomerAmt.toFixed(2),
          title: "Total Transaction Amount",
          class: `color-Grape-light`,
        }
      ]
      this.VendorKPIData = [
        {
          count: VendorAmt.toFixed(2),
          title: "Total Transaction Amount",
          class: `color-Grape-light`,
        }
      ]
    });

    // this.CustomerTableData = detail.map((x) => {
    //   const formattedDate = this.datePipe.transform(x.tTDT, 'dd-MMM-yy HH:mm a');
    //   const createdDate = this.datePipe.transform(x.eNTDT, 'dd-MMM-yy HH:mm a');
    //   return {
    //     ...x, vCAN: "Generated", tTDT: formattedDate, eNTDT: createdDate,
    //   };
    // });

  }
}
