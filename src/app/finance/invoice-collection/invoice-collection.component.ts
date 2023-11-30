import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { InvoiceCollectionControl } from 'src/assets/FormControls/Finance/CreditDebitVoucher/invoice-collection-control';

@Component({
  selector: 'app-invoice-collection',
  templateUrl: './invoice-collection.component.html',
})
export class InvoiceCollectionComponent implements OnInit {

  breadScrums = [
    {
      title: "Customer and GST Details",
      items: ["InvoiceCollection"],
      active: "Customer and GST Details",
    },
  ];
  CustomerGSTTableForm: UntypedFormGroup;
  CollectionSummaryTableForm:UntypedFormGroup;
  jsonControlArray: any;
  CollectionSummaryjsonControlArray: any;
  invocieCollectionFormControls: InvoiceCollectionControl;
  tableLoad: boolean = true;
  tableData = [
    {
      invoiceNumber:"BLMUMB232400098",
      invoiceDate:"10-Aug-23",
      dueDate:"22-Sep-23",
      invoiceAmount:23500.00,
      collected:2000.00,
      deductions:0.00,
      collectionAmount:21500.00,
      pendingAmount:0.00
    },
    {
      invoiceNumber:"BLMUMB232400112",
      invoiceDate:"12-Aug-23",
      dueDate:"20-Sep-23",
      invoiceAmount:34600.00,
      collected:0.00,
      deductions:1600.00,
      collectionAmount:32000.00,
      pendingAmount:1000.00
    },
    {
      invoiceNumber:"BLPUNB232400043",
      invoiceDate:"26-Aug-23",
      dueDate:"21-Sep-23",
      invoiceAmount:54000.00,
      collected:0.00,
      deductions:3200.00,
      collectionAmount:24500.00,
      pendingAmount:26300.00
    }
  ];
  menuItems = [];
  linkArray = [ { Row: 'deductions', Path: '',componentDetails: ""}];
  menuItemflag = true;
  addFlag = true;

  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };

  InvoiceDetailscolumnHeader = {
    invoiceNumber: {
      Title: "Invoice number",
      class: "matcolumnfirst",
      Style: "min-width:80px",
    },
    invoiceDate: {
      Title: "Invoice date",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    dueDate: {
      Title: "Due date",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    invoiceAmount: {
      Title: "Invoice Amount(₹)",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    collected: {
      Title: "Collected(₹)",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    deductions: {
      Title: "Deductions(₹)",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    collectionAmount: {
      Title: "Collection Amount(₹)",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    pendingAmount : {
      Title: "Pending Amount(₹)",
      class: "matcolumncenter",
      Style: "min-width:2px",
    }
  };
  staticField = [
    "invoiceNumber",
    "invoiceDate",
    "dueDate",
    "invoiceAmount",
    "collected",
    "collectionAmount",
    "pendingAmount",
  ];

  constructor(private fb: UntypedFormBuilder, private router: Router) {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      const data =
        this.router.getCurrentNavigation()?.extras?.state.data.columnData;
    }
    this.tableLoad = false;
    this.initializeFormControl();
  }

  ngOnInit(): void {
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
  initializeFormControl() {
    this.invocieCollectionFormControls = new InvoiceCollectionControl();
    // Get form controls for job Entry form section
    this.jsonControlArray = this.invocieCollectionFormControls.getCustomerGSTArrayControls();
    this.CollectionSummaryjsonControlArray = this.invocieCollectionFormControls.getCollectionSummaryArrayControls();
    // Build the form group using formGroupBuilder function
    this.CustomerGSTTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.CollectionSummaryTableForm = formGroupBuilder(this.fb, [this.CollectionSummaryjsonControlArray]);
  }
}
