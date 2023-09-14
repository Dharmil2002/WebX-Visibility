import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { TDSReconciliationControl, tdsReconciliationControl } from 'src/assets/FormControls/tds-reconciliation-control';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { FormControls } from 'src/app/Models/FormControl/formcontrol';

@Component({
  selector: 'app-tds-reconciliation',
  templateUrl: './tds-reconciliation.component.html',
})
export class TdsReconciliationComponent implements OnInit {

  TdsTableForm: UntypedFormGroup;
  TDSTableForm: UntypedFormGroup;
  jsonControlArray: any;
  TdsFormControls: tdsReconciliationControl;
  TDSFormControls: TDSReconciliationControl;
  tableLoad: boolean = true;
  tdsRec:boolean=true;
  dynamicControls = {
    add: true,
    edit: true,
    csv: false,
  };

  columnHeader = {
    CNC: {
      Title: "Customer Name & Code",
      class: "matcolumncenter",
      Style: "",
    },
    invoiceNo: {
      Title: "Invoice No",
      class: "matcolumncenter",
      Style: "",
    },
    taxableValue: {
      Title: "Taxable Value",
      class: "matcolumncenter",
      Style: "max-width: 110px",
    },
    gst: {
      Title: "GST",
      class: "matcolumncenter",
      Style: "max-width: 100px",
    },
    tdsReceivable: {
      Title: "TDS Receivable",
      class: "matcolumncenter",
      Style: "max-width: 100px",
    },
    mrNumber: {
      Title: "MR Number",
      class: "matcolumncenter",
      Style: "",
    },
    TaxableValue: {
      Title: "Taxable Value",
      class: "matcolumncenter",
      Style: "max-width: 100px",
    },
    TDSReceived: {
      Title: "TDS Received",
      class: "matcolumncenter",
      Style: "max-width: 80px",
    },
    date: {
      Title: "Date",
      class: "matcolumncenter",
      Style: "max-width: 80px",
    }
  };
  columnHeader1 = {
    CNC: {
      Title: "Customer Name & Code",
      class: "matcolumncenter",
      Style: "",
    },
    invoiceNo: {
      Title: "Invoice No",
      class: "matcolumncenter",
      Style: "",
    },
    taxableValue: {
      Title: "Taxable Value",
      class: "matcolumncenter",
      Style: "max-width: 110px",
    },
    gst: {
      Title: "GST",
      class: "matcolumncenter",
      Style: "max-width: 100px",
    },
    tdsReceivable: {
      Title: "TDS Receivable",
      class: "matcolumncenter",
      Style: "max-width: 100px",
    },
    mrNumber: {
      Title: "MR Number",
      class: "matcolumncenter",
      Style: "",
    },
    TaxableValue: {
      Title: "Taxable Value",
      class: "matcolumncenter",
      Style: "max-width: 100px",
    },
    TDSReceived: {
      Title: "TDS Received",
      class: "matcolumncenter",
      Style: "max-width: 80px",
    },
    date: {
      Title: "Date",
      class: "matcolumncenter",
      Style: "max-width: 80px",
    }
  };

  tableData = [
    {
      CNC: "DTDC : C000001",
      invoiceNo: "BLDTDDEL232400001",
      taxableValue: "Rs.120,345.00",
      gst: "23000.00",
      tdsReceivable: "76,345.00",
      mrNumber:"MRDEL23240000001",
      TaxableValue:"65,000.00",
      TDSReceived:'',
      date:'',
    },
    {
      CNC: "DTDC : C000001",
      invoiceNo: "BLDTDDEL232400002",
      taxableValue: "Rs.87,560.00",
      gst: "16075.00",
      tdsReceivable: "65,560.00",
      mrNumber:"MRDEL23240000002",
      TaxableValue:"54,560.00",
      TDSReceived:'',
      date:''
    },
    {
      CNC: "DTDC : C000001",
      invoiceNo: "BLDTDDEL232400003",
      taxableValue: "Rs.345,980.00",
      gst: "56000.00",
      tdsReceivable: "210,980.00",
      mrNumber:"MRDEL23240000003",
      TaxableValue:"189,980.00",
      TDSReceived:'',
      date:''
    }
  ];
  tableData1 = [
    {
      CNC: "DTDC : C000001",
      invoiceNo: "BLDTDDEL232400001",
      taxableValue: "Rs.120,345.00",
      gst: "23000.00",
      tdsReceivable: "76,345.00",
      mrNumber:"MRDEL23240000001",
      TaxableValue:"65,000.00",
      TDSReceived:'',
      date:'',
    },
    {
      CNC: "DTDC : C000001",
      invoiceNo: "BLDTDDEL232400002",
      taxableValue: "Rs.87,560.00",
      gst: "16075.00",
      tdsReceivable: "65,560.00",
      mrNumber:"MRDEL23240000002",
      TaxableValue:"54,560.00",
      TDSReceived:'',
      date:''
    },
    {
      CNC: "DTDC : C000001",
      invoiceNo: "BLDTDDEL232400003",
      taxableValue: "Rs.345,980.00",
      gst: "56000.00",
      tdsReceivable: "210,980.00",
      mrNumber:"MRDEL23240000003",
      TaxableValue:"189,980.00",
      TDSReceived:'',
      date:''
    }
  ];

  staticField = ["CNC", "invoiceNo", "taxableValue", "gst", "tdsReceivable", "mrNumber","TaxableValue","TDSReceived","date"];

  staticField1 = ["CNC", "invoiceNo", "taxableValue", "gst", "tdsReceivable", "mrNumber","TaxableValue","TDSReceived","date"];
  jsonControlArrayDetail:any;


  constructor(private fb: UntypedFormBuilder) {
    this.tableLoad = false;
   }

  ngOnInit(): void {
    this.initializeFormControl()
  }

  initializeFormControl() {
    this.TdsFormControls = new tdsReconciliationControl();
    this.TDSFormControls = new TDSReconciliationControl();
    // Get form controls for job Entry form section
    this.jsonControlArray = this.TdsFormControls.getHandOverArrayControls();
    this.jsonControlArrayDetail = this.TDSFormControls.getTDSReconciliationArrayControls();
    // Build the form group using formGroupBuilder function
    this.TdsTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.TDSTableForm = formGroupBuilder(this.fb, [this.jsonControlArrayDetail]);
    this.TdsTableForm.controls['brand'].setValue("R");
    this.changeBrand();
  }
  functionCalled($event) {
 
    let functionName = $event.functionName; // name of the function , we have to call

    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  changeBrand(){
    const brand=this.TdsTableForm.value.brand;
    if(brand=="H"){
        this.tdsRec=false;
    }
    else{
      this.tdsRec=true;
    }

  }
}
