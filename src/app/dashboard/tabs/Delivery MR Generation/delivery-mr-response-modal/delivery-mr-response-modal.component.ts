import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delivery-mr-response-modal',
  templateUrl: './delivery-mr-response-modal.component.html'
})
export class DeliveryMrResponseModalComponent implements OnInit {
  tableData: [] | any;
  tableload = true; // flag , indicates if data is still loading or not , used to show loading animation
  companyCode: number = parseInt(localStorage.getItem("companyCode"));
  menuItemflag: boolean = false;
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  breadscrums = [
    {
      title: "Delivery MR Generation",
      items: ["Dashboard"],
      active: "Delivery MR Generation",
    },
  ];
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  linkArray = [];
  toggleArray = [];
  columnHeader = {
    dOCNO: {
      Title: "Consignment Note Number",
      class: "matcolumncenter",
      //Style: "min-width:40%",
    },
    dLMRNO: {
      Title: "Delivery MR Number",
      class: "matcolumncenter",
      // Style: "min-width:40%",
    },
    Actions: {
      Title: "Action",
      class: "matcolumncenter",
      //Style: "min-width:20%",
      type: "Link",
      functionName: "openviewprint"
    },
  };

  staticField = [
    "dOCNO",
    "dLMRNO"
  ];
  resultData: any;
  backPath: any;
  constructor(
    private router: Router,
    //private dialogRef: MatDialogRef<DeliveryMrResponseModalComponent>,
    // @Inject(MAT_DIALOG_DATA)
    // private objResult: any,
  ) {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      const data = this.router.getCurrentNavigation()?.extras?.state.data;
      console.log(data);
      this.resultData = data.ops;
    } else {
      this.redirectToMRGeneration();
    }
  }
  ngOnInit(): void {
    this.backPath = "/dashboard/DeliveryMrGeneration";
    this.setResult();
  }
  //#region to handle functionCallHandler
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  //#endregion
  redirectToMRGeneration() {
    this.router.navigate(["/dashboard/DeliveryMrGeneration"]);
  }
  setResult() {
    this.tableload = true;
    // Updates the tableData by adding an 'Actions' property with the value "View & Print"
    this.tableData = this.resultData.map(x => ({
      ...x, Actions: "View & Print"
    }));
    this.tableload = false;
  }

  //#region Navigation to Delivery tab

  /**
   * Navigates to the "Delivery" tab using the Router.
   */
  navigateToDeliveryTab(): void {
    this.navigateWithTabIndex('Delivery');
  }

  /**
   * Navigates back to the specified tab index using the Router.
   * @param tabIndex The index of the tab to navigate back to.
   */
  navigateWithTabIndex(tabIndex: string): void {
    this.router.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex } });
  }

  //#endregion
}