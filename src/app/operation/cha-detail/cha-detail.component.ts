import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { CHAControl } from "src/assets/FormControls/cha-detail-contorl";
import { calculateTotalField } from "../unbilled-prq/unbilled-utlity";

@Component({
  selector: "app-cha-detail",
  templateUrl: "./cha-detail.component.html",
})
export class ChaDetailComponent implements OnInit {
  HandFormControls: CHAControl;
  jsonControlArray: any;
  KPICountData: { count: any; title: string; class: string }[];
  handTableForm: UntypedFormGroup;
  columnHeader = {
    NOD: {
      Title: "Name of Document",
      class: "matcolumncenter",
      Style: "",
    },
    CCC: {
      Title: "Custome Clearance Charge",
      class: "matcolumncenter",
      Style: "",
    },
    GR: {
      Title: "GST Rate ",
      class: "matcolumncenter",
      Style: "",
    },
    GA: {
      Title: "GST Amount",
      class: "matcolumncenter",
      Style: "",
    },
    TA: {
      Title: "Total Amount",
      class: "matcolumncenter",
      Style: "",
    },
  };
  staticField = ["NOD", "CCC", "GR", "GA", "TA"];
  breadScrums = [
    {
      title: "CHA Details",
      items: ["Home"],
      active: "CHA Details",
    },
  ];
  dynamicControls = {
    add: false,
    edit: true,
    csv: false,
  };
  tableData = [
    {
      NOD: 10,
      CCC: 20,
      GR: "10%",
      GA: 2000,
      TA: 3500,
    },
    {
      NOD: 10,
      CCC: 30,
      GR: "10%",
      GA: 3000,
      TA: 4500,
    },
    {
      NOD: 10,
      CCC: 40,
      GR: "10%",
      GA: 4000,
      TA: 5500,
    }
  ];
  tableLoad: boolean = true;
  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    private masterService: MasterService
  ) {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      const data =
        this.router.getCurrentNavigation()?.extras?.state.data.columnData;
    }
    this.tableLoad = false;
    const GA = calculateTotalField(this.tableData, 'GA');
    const TA = calculateTotalField(this.tableData, 'TA');
    this.KPICountData = [
      {
        count: GA,
        title: "GST Amount",
        class: `color-Grape-light`,
      },
      {
        count: TA,
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
    this.HandFormControls = new CHAControl();
    // Get form controls for job Entry form section
    this.jsonControlArray = this.HandFormControls.getHandOverArrayControls();
    // Build the form group using formGroupBuilder function
    this.handTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }
  cancel() {
    this.goBack("Tracker")
  } 
  save() {}
  goBack(tabIndex: string): void {
    this.router.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex }, state: [] });
  }
}
