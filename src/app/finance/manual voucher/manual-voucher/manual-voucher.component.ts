import { Component, OnInit } from '@angular/core';
import { manualvoucharDetail } from './manual-voucher-utility';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { VoucherControlControl } from 'src/assets/FormControls/Finance/VoucherEntry/Vouchercontrol';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';

@Component({
  selector: 'app-manual-voucher',
  templateUrl: './manual-voucher.component.html'
})
export class ManualVoucherComponent implements OnInit {
  tableLoad: boolean = true;
  tableData: any;
  addAndEditPath: string;
  dynamicControls = {
    add: true,
    edit: true,
    csv: false,
  };
  TableStyle = "width:100%"
  columnHeader = {
    vNO: {
      Title: "Voucher No",
      class: "matcolumncenter",
      Style: "max-width:200px",
      type: "Link",
      functionName: "VoucherNoFunction",
    },
    vTYPNM: {
      Title: "Voucher Type",
      class: "matcolumncenter",
      Style: "max-width: 160px",
    },
    tTDT: {
      Title: "Voucher  Date",
      class: "matcolumncenter",
      Style: "max-width: 200px",
    },
    nNETP: {
      Title: "Amount(₹)",
      class: "matcolumncenter",
      Style: "max-width: 150px",
    },
    eNTBY: {
      Title: "Created By",
      class: "matcolumncenter",
      Style: "max-width: 150px",
    },
    eNTDT: {
      Title: "Created on",
      class: "matcolumncenter",
      Style: "max-width: 200px",
    },
    vCAN: {
      Title: "Status",
      class: "matcolumncenter",
      Style: "max-width: 110px",
    },

  };
  staticField = [
    // "vNO",
    "vTYPNM",
    "tTDT",
    "nNETP",
    "eNTBY",
    "eNTDT",
    "vCAN"
  ];

  linkArray = [

  ]
  VoucherControl: VoucherControlControl;
  AllTableData = [];
  VoucherSummaryForm: UntypedFormGroup;
  jsonControlVoucherSummaryArray: any;

  constructor(
    private masterService: MasterService,
    private datePipe: DatePipe,
    private router: Router,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils
  ) {
    this.addAndEditPath = "Finance/VoucherEntry/DebitVoucher";
  }
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  ngOnInit(): void {
    this.getVoucherList();
    this.initializeFormControl()
  }
  initializeFormControl() {
    this.VoucherControl = new VoucherControlControl("");
    this.jsonControlVoucherSummaryArray =
      this.VoucherControl.getVoucherArrayControls();
    this.VoucherSummaryForm = formGroupBuilder(this.fb, [
      this.jsonControlVoucherSummaryArray,
    ]);

  }
  async getVoucherList() {
    const detail = await manualvoucharDetail(this.masterService);
    this.AllTableData = detail.map((x) => {
      const formattedDate = this.datePipe.transform(x.tTDT, 'dd-MMM-yy HH:mm a');
      const createdDate = this.datePipe.transform(x.eNTDT, 'dd-MMM-yy HH:mm a');
      return {
        ...x, vCAN: "Generated", tTDT: formattedDate, eNTDT: createdDate,
        actions: ["Modify", "Delete"]
      };
    });

    this.tableData = this.AllTableData;
    this.tableLoad = false;

    const uniqueTYP = new Set(this.AllTableData.map(item => item.vTYPNM));

    // Convert Set to array if needed
    const uniqueTYPArray = Array.from(uniqueTYP);
    console.log(uniqueTYPArray)

    const voucherTypelist: any[] = uniqueTYPArray.map(item => ({
      name: item,
      value: item
    }));

    this.filter.Filter(
      this.jsonControlVoucherSummaryArray,
      this.VoucherSummaryForm,
      voucherTypelist,
      "VoucherType",
      false
    );
  }

  VoucherTypeFieldChanged(event) {
    const selectedField = event?.eventArgs.option.value.value
    this.tableLoad = true;
    this.tableData = this.AllTableData.filter(item => item.vTYPNM == selectedField)
    this.tableLoad = false;



    switch (selectedField) {
      case "DebitVoucher":
        this.addAndEditPath = "Finance/VoucherEntry/DebitVoucher";
        break;
      // case "VendorBillPayment":
      //   this.addAndEditPath = "Finance/VendorPayment/VendorBillPayment";
      //   break;
      case "JournalVoucher":
        this.addAndEditPath = "Finance/VoucherEntry/JournalVoucher";
        break;
      case "ContraVoucher":
        this.addAndEditPath = "Finance/VoucherEntry/ContraVoucher";
        break;
      // case "Delivery MR Voucher":
      //   this.addAndEditPath = "dashboard/Index";
      //   break;
      default:
        this.addAndEditPath = "Finance/VoucherEntry/DebitVoucher";
        break;

    }

  }
  async handleMenuItemClick(data) {
    if (data.label.label === "Modify") {
      this.router.navigate(['Finance/DebitVoucher'], {
        state: {
          data: data.data
        },
      });
    }
  }
  VoucherNoFunction(event) {
    const templateBody = {
      DocNo: event.data.vNO,
      templateName: "Voucher View-Print",
    };
    const url = `${window.location.origin
      }/#/Operation/view-print?templateBody=${JSON.stringify(templateBody)}`;
    window.open(url, "", "width=1000,height=800");
  }
}
