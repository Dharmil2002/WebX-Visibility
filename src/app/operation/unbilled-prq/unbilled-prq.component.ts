import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { calculateTotalField } from './unbilled-utlity';

@Component({
  selector: 'app-unbilled-prq',
  templateUrl: './unbilled-prq.component.html'
})
export class UnbilledPrqComponent implements OnInit {

  // HandFormControls: VoucherdetaisControl;
  jsonControlArray: any;
  KPICountData: { count: any; title: string; class: string }[];

  handTableForm: UntypedFormGroup;
  columnHeader = {
    checkBoxRequired: {
      Title: "",
      class: "matcolumncenter",
      Style: "max-width: 60px",
    },
    RequestiD: {
      Title: "Request ID",
      class: "matcolumncenter",
      Style: "min-width: 150px",
    },
    Requesteddate: {
      Title: "Requested Date",
      class: "matcolumncenter",
      Style: "",
    },
    Billingparty: {
      Title: "Billing Party",
      class: "matcolumncenter",
      Style: "",
    },
    Vehicleno: {
      Title: "Vehicle No",
      class: "matcolumncenter",
      Style: "",
    },
    Dokno: {
      Title: "Docket No",
      class: "matcolumncenter",
      Style: "",
    },
    FTcity: {
      Title: "From & To City",
      class: "matcolumncenter",
      Style: "",
    },
    Famount: {
      Title: "Freight Amount",
      class: "matcolumncenter",
      Style: "",
    },
    Oamount: {
      Title: "Other Amount",
      class: "matcolumncenter",
      Style: "",
    },
    Gtotal: {
      Title: "Gross Total",
      class: "matcolumncenter",
      Style: "",
    },
    Gstrate: {
      Title: "GST Rate",
      class: "matcolumncenter",
      Style: "max-width: 60px",
    },
    Gstamount: {
      Title: "GST Amount",
      class: "matcolumncenter",
      Style: "",
    },
    Grandtotal: {
      Title: "Grand Total",
      class: "matcolumncenter",
      Style: "",
    },
    mode: {
      Title: "Mode",
      class: "matcolumncenter",
      Style: "",
    },
    Pdatetime: {
      Title: "Pickup Date & Time",
      class: "matcolumncenter",
      Style: "",
    },
  };
  staticField = ["RequestiD", "Requesteddate", "Billingparty", "Vehicleno",  "Dokno", "FTcity",
  "Famount", "Oamount", "Gtotal","Gstrate", "Gstamount", "Grandtotal", "mode", "Pdatetime"];
  breadScrums = [
    {
      title: "PRQ List",
      items: ["Home"],
      active: "PRQ List",
    },
  ];
  dynamicControls = {
    add: false,
    edit: true,
    csv: false,
  };
  metaData = {
    checkBoxRequired: true,
    noColumnSort: ['checkBoxRequired']
  }
  tableData = [
    {
      RequestiD: "PRQ/DELB/0000001",
      Requesteddate: "16 Aug 2023",
      Billingparty: "ABC Roadways",
      Vehicleno: "MH46AA7686",
      Dokno:"CNDELB5889",
      FTcity:"New Delhi-Mumbai",
      Famount:12200.00,
      Oamount:7800.00,
      Gtotal:20000.00,
      Gstrate:"12%",
      Gstamount:2400.00,
      Grandtotal:22400.00,
      mode:"Road",
      Pdatetime:"18 Aug 2023"
    },
    {
      RequestiD: "PRQ/DELB/0000002",
      Requesteddate: "16 Aug 2023",
      Billingparty: "ABC Roadways",
      Vehicleno: "WB48BB9653",
      Dokno:"CNDELB5890",
      FTcity:"New Delhi-Mumbai",
      Famount:12200.00,
      Oamount:5000.00,
      Gtotal:17200.00,
      Gstrate:"12%",
      Gstamount:2064.00,
      Grandtotal:19264.00,
      mode:"Train",
      Pdatetime:"18 Aug 2023"
    },
    {
      RequestiD: "PRQ/DELB/0000003",
      Requesteddate: "16 Aug 2023",
      Billingparty: "ABC Roadways",
      Vehicleno: "UP56AH6325",
      Dokno:"CNDELB5891",
      FTcity:"New Delhi-Mumbai",
      Famount:12200.00,
      Oamount:2000.00,
      Gtotal:14200.00,
      Gstrate:"12%",
      Gstamount:1704.00,
      Grandtotal:15904.00,
      mode:"Train",
      Pdatetime:"18 Aug 2023"
    },
  ];
  tableLoad: boolean = true;
  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    // private masterService: MasterService
  ) {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      const data =
        this.router.getCurrentNavigation()?.extras?.state.data.columnData;
    }
    const Grandtotal = calculateTotalField(this.tableData, 'Grandtotal');
    const Gstamount = calculateTotalField(this.tableData, 'Gstamount');
    const Famount = calculateTotalField(this.tableData, 'Famount');
    const Oamount = calculateTotalField(this.tableData, 'Oamount');
    const Gtotal = calculateTotalField(this.tableData, 'Gtotal');
    this.tableLoad = false;
    this.KPICountData = [
      {
        count:Famount,
        title: "Freight Amount",
        class: `color-Grape-light`,
      },
      {
        count: Oamount,
        title: "Other Amount",
        class: `color-Bottle-light`,
      },
      {
        count: Gtotal,
        title: "Gross Total",
        class: `color-Daisy-light`,
      },
      {
        count: Gstamount,
        title: "GST Amount",
        class: `color-Success-light`,
      },
      {
        count: Grandtotal,
        title: "Grand Total",
        class: `color-Grape-light`,
      },
    ]
  }

  ngOnInit(): void {}

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
  cancel() {
    window.history.back();
  }
  save() {}

}
