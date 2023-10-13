import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { VendorbillControl } from 'src/assets/FormControls/vendor-bill-details-control';
import { calculateTotalField } from '../unbilled-prq/unbilled-utlity';

@Component({
  selector: 'app-vendor-bill-details',
  templateUrl: './vendor-bill-details.component.html'
})
export class VendorBillDetailsComponent implements OnInit {

  HandFormControls: VendorbillControl;
  jsonControlArray: any;
  KPICountData: { count: any; title: string; class: string }[];
  handTableForm: UntypedFormGroup;
  columnHeader = {
    VNC: {
      Title: "Vendor Name & Code",
      class: "matcolumncenter",
      Style: "",
    },
    Billnumber: {
      Title: "Bill Number",
      class: "matcolumncenter",
      Style: "",
    },
    Billdate: {
      Title: "Bill Date",
      class: "matcolumncenter",
      Style: "",
    },
    Billamount: {
      Title: "Bill Amount",
      class: "matcolumncenter",
      Style: "",
    },
    GR: {
      Title: "GST Rate",
      class: "matcolumncenter",
      Style: "",
    },
    Gstamount: {
      Title: "GST Amount",
      class: "matcolumncenter",
      Style: "",
    },
    Totalamount: {
      Title: "Total Amount",
      class: "matcolumncenter",
      Style: "",
    },
  };
  staticField = ["VNC", "Billnumber", "Billdate", "Billamount", "GR", "Gstamount","Totalamount"];
  breadScrums = [
    {
      title: "Vendor Bill Details",
      items: ["Home"],
      active: "Vendor Bill Details",
    },
  ];
  dynamicControls = {
    add: false,
    edit: true,
    csv: false,
  };
  tableData = [
    {
      VNC: "Dhval : 1002",
      Billnumber: 101,
      Billdate: "25 Aug 2023",
      Billamount: 9000,
      GR: "12%",
      Gstamount:10080,
      Totalamount:10080
    },
    {
      VNC: "Nishi : 1003",
      Billnumber: 102,
      Billdate: "25 Aug 2023",
      Billamount: 9000,
      GR: "12%",
      Gstamount:10080,
      Totalamount:10080
    },
    {
      VNC: "Manan : 1003",
      Billnumber: 103,
      Billdate: "25 Aug 2023",
      Billamount: 9000,
      GR: "12%",
      Gstamount:10080,
      Totalamount:10080
    }
  ];
  tableLoad: boolean = true;
  constructor(
    private router: Router,
    private fb: UntypedFormBuilder
  ) {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      const data =
        this.router.getCurrentNavigation()?.extras?.state.data.columnData;
    }
    this.tableLoad = false;
    const Gstamount = calculateTotalField(this.tableData, 'Gstamount');
    const Totalamount = calculateTotalField(this.tableData, 'Totalamount');
    this.KPICountData = [
      {
        count: Gstamount,
        title: "GST Amount",
        class: `color-Grape-light`,
      },
      {
        count: Totalamount,
        title: "Total Amount",
        class: `color-Bottle-light`,
      },
    ]
    this.initializeFormControl();
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

  initializeFormControl() {
    this.HandFormControls = new VendorbillControl();
    // Get form controls for job Entry form section
    this.jsonControlArray = this.HandFormControls.getHandOverArrayControls();
    // Build the form group using formGroupBuilder function
    this.handTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }
  cancel() {
    this.goBack('Tracker')
  } 
  save() {}
  goBack(tabIndex: string): void {
    this.router.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex }, state: [] });
  }

}
